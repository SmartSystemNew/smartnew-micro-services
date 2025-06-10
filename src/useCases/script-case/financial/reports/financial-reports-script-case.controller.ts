import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import { BranchRepository } from 'src/repositories/branch-repository';
import ContractTypeInputRepository from 'src/repositories/contract-type-input-repository';
import FinanceControlRepository from 'src/repositories/finance-control-repository';
import { FinancePaymentRepository } from 'src/repositories/finance-payment-repository';
import FinanceRepository from 'src/repositories/finance-repository';
import FinanceBankTransactionRepository from 'src/repositories/financeBankTransaction-repository';
import MaterialRepository from 'src/repositories/material-repository';
import ProviderRepository from 'src/repositories/provider-repository';
import { DateService } from 'src/service/data.service';
import { z } from 'zod';
import GenerateReportQuery from './dtos/generateReport-query';

@ApiTags('Script Case - Financial - Reports')
@Controller('/script-case/financial/reports')
export default class FinancialReportsScriptCaseController {
  constructor(
    private dateService: DateService,
    private financePaymentRepository: FinancePaymentRepository,
    private providerRepository: ProviderRepository,
    private branchRepository: BranchRepository,
    private materialRepository: MaterialRepository,
    private contractTypeInputRepository: ContractTypeInputRepository,
    private financeBankTransactionRepository: FinanceBankTransactionRepository,
    private financeRepository: FinanceRepository,
    private financeControlRepository: FinanceControlRepository,
  ) {}

  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Get('/payment-items')
  async generateReportFinanceItem(@Req() req, @Query() query) {
    const user: IUserInfo = req.user;

    const schemaQuery = z.object({
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
      branch: z.string().transform((value) => value.split(',').map(Number)),
      type: z.enum(['pagar', 'receber']).default('pagar'),
      paid: z
        .string()
        .optional()
        .default('false')
        .transform((value) => value === 'true'),
    });

    const body = schemaQuery.parse(query);

    const allPayment = body.paid
      ? await this.financePaymentRepository.listItemsByDateAndDirectionAndDescriptionCostCenterAndPay(
          user.clientId,
          body.startDate,
          body.endDate,
          body.type,
          body.branch,
        )
      : await this.financePaymentRepository.listItemsByDateAndDirectionAndDescriptionCostCenter(
          user.clientId,
          body.startDate,
          body.endDate,
          body.type,
          body.branch,
        );
    const allProvider = await this.providerRepository.listByBranches(
      user.branches,
      user.clientId,
    );

    const allMaterial = await this.materialRepository.listByClientAndActive(
      user.clientId,
    );

    const allInput = await this.contractTypeInputRepository.listByClient(
      user.clientId,
    );

    const response = allPayment.map((payment) => {
      const providerId =
        body.type === 'pagar'
          ? payment.finance.emitente
          : payment.finance.remetente;

      const branchId =
        body.type === 'pagar'
          ? payment.finance.remetente
          : payment.finance.emitente;

      const branch = user.branch.find((value) => value.id === branchId);

      const provider = allProvider.find((value) => value.ID === providerId);

      return {
        id: payment.finance.id,
        number: payment.finance.numero_fiscal,
        emissionDate: this.dateService
          .dayjsAddTree(payment.finance.data_emissao)
          .format('YYYY/MM/DD'),
        dueDate: this.dateService
          .dayjsAddTree(payment.prorrogacao)
          .format('YYYY/MM/DD'),
        issue: provider.razao_social,
        sender: branch.name,
        observation: payment.finance.observacoes,
        typePayment: payment.finance.paymentType.descricao,
        splitValue: payment.valor_parcela,
        liquidTotal: payment.finance.total_liquido,
        quantityInstallment: `${payment.parcela}/${
          payment.finance.quantidade_parcela === null ||
          payment.finance.quantidade_parcela === 0
            ? 1
            : payment.finance.quantidade_parcela
        }`,
        items: payment.finance.items.map((item) => {
          const input =
            body.type === 'pagar'
              ? item.id_insumo !== null
                ? allMaterial.find((value) => value.id === item.id_insumo)
                    .material
                : item.material.material
              : allInput.find((value) => value.id === item.id_insumo).insumo;

          return {
            id: item.id,
            material: input,
            sector:
              item.compositionItem.compositionGroup.costCenter
                .descriptionCostCenter.descricao_centro_custo,
            compositionItem: `${item.compositionItem.composicao}-${item.compositionItem.descricao}`,
            bound:
              item.vinculo && item.vinculo === 'STOCK'
                ? 'ESTOQUE'
                : item.vinculo === null
                ? 'SEM REGISTRO'
                : item.order
                ? `${item.order.ordem}-${item.order.equipment.equipamento_codigo}-${item.order.equipment.descricao}`
                : `${item.equipment.equipamento_codigo}-${item.equipment.descricao}`,
            total: item.total,
          };
        }),
      };
    });

    return {
      report: response,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/movimentation')
  async generateReport(@Req() req, @Query() query) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      branchId: z.string().transform((value) => value.split(',').map(Number)),
      bank: z
        .string()
        .transform((value) =>
          value === '' ? [] : value.split(',').map(Number),
        )
        .optional(),
      dateFrom: z.coerce.date(),
      dateTo: z.coerce.date(),
      pay: z.string().transform((value) => value === 'true'),
      withBank: z.string().transform((value) => value === 'true'),
      direction: z
        .string()
        .transform((value) =>
          value.split(',')[0] === '' ? [] : value.split(','),
        ),
    });

    const body: GenerateReportQuery = querySchema.parse(query);

    const { direction } = body;

    let allPaymentPay = [];
    let allPaymentReceive = [];

    if (
      direction.includes('pagar') ||
      direction.length === 0 ||
      direction.some((value) => value.trim() === 'pagar') ||
      !direction ||
      direction === undefined
    ) {
      allPaymentPay = body.pay
        ? await this.financePaymentRepository.listItemsByDateAndDirectionAndDescriptionCostCenterAndPay(
            user.clientId,
            body.dateFrom,
            body.dateTo,
            'pagar',
            body.branchId,
            body.bank.length ? body.bank : null,
          )
        : await this.financePaymentRepository.listItemsByDateAndDirectionAndDescriptionCostCenter(
            user.clientId,
            body.dateFrom,
            body.dateTo,
            'pagar',
            body.branchId,
          );
    }

    if (
      direction.includes('receber') ||
      direction.length === 0 ||
      direction.some((value) => value.trim() === 'receber') ||
      !direction ||
      direction === undefined
    ) {
      allPaymentReceive = body.pay
        ? await this.financePaymentRepository.listItemsByDateAndDirectionAndDescriptionCostCenterAndPay(
            user.clientId,
            body.dateFrom,
            body.dateTo,
            'receber',
            body.branchId,
            body.bank.length ? body.bank : null,
          )
        : await this.financePaymentRepository.listItemsByDateAndDirectionAndDescriptionCostCenter(
            user.clientId,
            body.dateFrom,
            body.dateTo,
            'receber',
            body.branchId,
          );
    }

    const response = [];
    let balance = 0;

    const startDate = this.dateService.dayjsSubTree('2010-01-01').toDate();
    const endDate = this.dateService
      .dayjsSubTree(body.dateFrom)
      .subtract(1, 'D')
      .toDate();

    const moveBankIn =
      await this.financeBankTransactionRepository.sumAllBankValuesByClient(
        user.clientId,
        ['MANUAL___ENTRADA', 'ESTORNO'],
        {
          start: startDate,
          end: endDate,
        },
      );

    const moveBankOut =
      await this.financeBankTransactionRepository.sumAllBankValuesByClient(
        user.clientId,
        ['MANUAL___SAIDA', 'REEMBOLSO'],
        {
          start: startDate,
          end: endDate,
        },
      );

    balance += moveBankIn - moveBankOut;

    const allProvider = await this.providerRepository.listByBranches(
      user.branches,
      user.clientId,
    );

    const allPaymentPayForSum =
      await this.financePaymentRepository.listItemsByDateAndDirectionAndDescriptionCostCenterAndPay(
        user.clientId,
        startDate,
        endDate,
        'pagar',
        body.branchId,
        body.bank.length ? body.bank : null,
      );

    const allPaymentReceiveForSum =
      await this.financePaymentRepository.listItemsByDateAndDirectionAndDescriptionCostCenterAndPay(
        user.clientId,
        startDate,
        endDate,
        'receber',
        body.branchId,
        body.bank.length ? body.bank : null,
      );

    balance +=
      allPaymentReceiveForSum.reduce(
        (acc, curr) => acc + curr.valor_parcela,
        0,
      ) -
      allPaymentPayForSum.reduce((acc, curr) => acc + curr.valor_parcela, 0);

    const previous = balance;

    allPaymentPay.forEach((item) => {
      //balance -= item.valor_parcela;

      const provider = allProvider.find(
        (value) => value.ID === item.finance.emitente,
      );

      response.push({
        id: item.id,
        amount: item.valor_parcela,
        balance: 0,
        category: item.finance.paymentType.descricao,
        date: body.pay
          ? item.emissionItem.emission.data_vencimento
          : item.prorrogacao
          ? item.prorrogacao
          : item.vencimento,
        title: `${item.finance.numero_fiscal}-${provider.razao_social}`,
        type: 'expense',
      });
    });

    allPaymentReceive.forEach((item) => {
      const provider = allProvider.find(
        (value) => value.ID === item.finance.remetente,
      );

      response.push({
        id: item.id,
        amount: item.valor_parcela,
        balance: 0,
        category: item.finance.paymentType.descricao,
        date: body.pay
          ? item.emissionItem.emission.data_vencimento
          : item.prorrogacao
          ? item.prorrogacao
          : item.vencimento,
        title: `${item.finance.numero_fiscal}-${provider.razao_social}`,
        type: 'debit',
      });
    });

    if (body.withBank) {
      const allBankTransaction = body.bank.length
        ? await this.financeBankTransactionRepository.listByBank(body.bank, {
            start: body.dateFrom,
            end: body.dateTo,
          })
        : await this.financeBankTransactionRepository.listByClient(
            user.clientId,
            {
              start: body.dateFrom,
              end: body.dateTo,
            },
          );

      allBankTransaction.forEach((item) => {
        if (item.tipo !== 'ENTRADA' && item.tipo !== 'SAIDA')
          response.push({
            id: item.id,
            date: item.data_lancamento,
            amount: item.valor,
            balance: 0,
            title: `${item.bank.agencia}/${item.bank.nome}`,
            category:
              item.tipo === 'MANUAL___SAIDA'
                ? 'MANUAL - SAIDA'
                : item.tipo === 'MANUAL___ENTRADA'
                ? 'MANUAL - ENTRADA'
                : item.tipo,
            type:
              item.tipo === 'MANUAL___ENTRADA' || item.tipo === 'ESTORNO'
                ? 'debit'
                : item.tipo === 'MANUAL___SAIDA' || item.tipo === 'REEMBOLSO'
                ? 'expense'
                : null,
          });
      });
    }

    response.sort((a, b) => a.date.getTime() - b.date.getTime());

    response.forEach((item) => {
      item.date = this.dateService.dayjs(item.date).format('YYYY-MM-DD');
      if (item.type === 'debit') {
        balance += item.amount;
        item.balance = balance;
      } else if (item.type === 'expense') {
        balance -= item.amount;
        item.balance = balance;
      }
    });

    return {
      installment: response,
      previous,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-provider-in-finance')
  async listProviderInFinance(@Req() req) {
    const user: IUserInfo = req.user;

    const allProvider = await this.providerRepository.listByBranches(
      user.branches,
      user.clientId,
    );

    const allFinance = await this.financeRepository.listFinanceByClient(
      user.clientId,
    );

    const response = [];

    allFinance.forEach((item) => {
      if (item.direcao === 'pagar') {
        const provider = allProvider.find(
          (value) => value.ID === item.emitente,
        );

        if (!provider) {
          response.push(item);
        }
      } else {
        const provider = allProvider.find(
          (value) => value.ID === item.remetente,
        );
        if (!provider) {
          response.push(item);
        }
      }
    });

    return response;
  }
}
