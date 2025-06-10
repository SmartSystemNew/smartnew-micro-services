import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
//import * as dayjs from 'dayjs';
import dayjs from 'dayjs';
import { AuthGuard } from 'src/guard/auth.guard';
import { PermissionGuard } from 'src/guard/permissions.guard';
import { IFinancePrisma } from 'src/models/IFinance';
import { IUserInfo } from 'src/models/IUser';
import { BranchRepository } from 'src/repositories/branch-repository';
import ContractTypeInputRepository from 'src/repositories/contract-type-input-repository';
import EmissionRepository from 'src/repositories/emission-repository';
import EquipmentRepository from 'src/repositories/equipment-repository';
import FinanceBankRepository from 'src/repositories/finance-bank-repository';
import FinanceControlRepository from 'src/repositories/finance-control-repository';
import FinanceEmissionItemRepository from 'src/repositories/finance-emissionItem-repository';
import FinanceItemBoundRepository from 'src/repositories/finance-item-bound-repository';
import { FinanceItemRepository } from 'src/repositories/finance-item-repository';
import FinanceNumberRepository from 'src/repositories/finance-number-repository';
import FinanceNumberTypeDocument from 'src/repositories/finance-numberTypeDocument-repository';
import { FinancePaymentRepository } from 'src/repositories/finance-payment-repository';
import { FinancePaymentViewRepository } from 'src/repositories/finance-payment-view-repository';
import FinanceRegisterTributeRepository from 'src/repositories/finance-registerTribute-repository';
import FinanceRepository from 'src/repositories/finance-repository';
import FinanceStatusRepository from 'src/repositories/finance-status-repository';
import FinanceTypeDocumentRepository from 'src/repositories/finance-typeDocument-repository';
import FinanceTypePaymentRepository from 'src/repositories/finance-typePayment-repository';
import FinanceBankTransactionRepository from 'src/repositories/financeBankTransaction-repository';
import FinanceEmissionTaxationRepository from 'src/repositories/financeEmissionTaxation-repository';
import FinanceTaxationRepository from 'src/repositories/financeTaxation-repository';
import LogFinanceRepository from 'src/repositories/log-finance-repository';
import MaterialRepository from 'src/repositories/material-repository';
import ProviderRepository from 'src/repositories/provider-repository';
import ServiceOrderRepository from 'src/repositories/service-order-repository';
import { ENVService } from 'src/service/env.service';
import { FTPService } from 'src/service/ftp.service';
import { MessageService } from 'src/service/message.service';
import { z } from 'zod';
import CreateEmissionBody from './dtos/createEmission-body';
import { CreateItemBody } from './dtos/createItem-body';
import deleteAttachBody from './dtos/deleteAttach-body';
import DuplicateFinanceBody from './dtos/duplicateFinance-body';
import findEmissionBody from './dtos/findEmission-body';
import { findEmissionResponse } from './dtos/findEmission-response';
import { FindFinanceResponse } from './dtos/findFinance-response';
import { InfoTableQuery } from './dtos/infoTable-query';
import infoTableResponse from './dtos/infoTable-response';
import InsertFinanceBody from './dtos/insertFinance-body';
import InsertTaxationBody from './dtos/insertTaxation-body';
import InsertRegisterBody from './dtos/insertTribute-body';
import ListFinanceQuery from './dtos/listFinance-query';
import UpdateEmissionBody from './dtos/updateEmission-body';
import UpdateFinanceBody from './dtos/updateFinance-body';
import UpdateInstallmentFinanceBody from './dtos/updateInstallmentFinance-body';
import UpdateItemBody from './dtos/updateItem-body';
import UpdatePaymentBody from './dtos/updatePayment-body';
import UpdateRegisterBody from './dtos/updateRegister-body';
import { ApiTags } from '@nestjs/swagger';
//import FindFinanceByFilterQuery from './dtos/findFinanceByFilter-query copy';

@ApiTags('Financial - Account')
@Controller('financial/account')
export class AccountController {
  constructor(
    private financePaymentViewRepository: FinancePaymentViewRepository,
    private financePaymentRepository: FinancePaymentRepository,
    private emissionRepository: EmissionRepository,
    private financeBankRepository: FinanceBankRepository,
    private financeBankTransactionRepository: FinanceBankTransactionRepository,
    private financeTaxationRepository: FinanceTaxationRepository,
    private financeEmissionTaxationRepository: FinanceEmissionTaxationRepository,
    private financeEmissionItemRepository: FinanceEmissionItemRepository,
    private financeStatusRepository: FinanceStatusRepository,
    private financeTypeDocumentRepository: FinanceTypeDocumentRepository,
    private financeTypePaymentRepository: FinanceTypePaymentRepository,
    private branchRepository: BranchRepository,
    private providerRepository: ProviderRepository,
    private financeRepository: FinanceRepository,
    private financeNumberTypeDocumentRepository: FinanceNumberTypeDocument,
    private financeNumberRepository: FinanceNumberRepository,
    private logFinanceRepository: LogFinanceRepository,
    private financeControlRepository: FinanceControlRepository,
    private orderRepository: ServiceOrderRepository,
    private equipmentRepository: EquipmentRepository,
    private financeItemRepository: FinanceItemRepository,
    private financeItemBoundRepository: FinanceItemBoundRepository,
    private materialRepository: MaterialRepository,
    private contractTypeInputRepository: ContractTypeInputRepository,
    private financeRegisterTributeRepository: FinanceRegisterTributeRepository,
    private ftpService: FTPService,
    private envService: ENVService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async infoTable(@Req() req, @Query() query: InfoTableQuery) {
    const user: IUserInfo = req.user;

    await this.financePaymentRepository.updateStatusToExpired(user.clientId);

    const queryParams = z.object({
      type: z.enum(['pagar', 'receber']),
      perPage: z.coerce.number().optional().default(10),
      index: z.coerce.number().optional().default(0),
      fiscalNumber: z.coerce.number().optional(),
    });

    const queryResponse = queryParams.parse(query);

    const { status, dateEmission, dueDate, prorogation, expectDate } = query;

    if (status) {
      status.forEach((item, index) => {
        status[index] = item;
      });
    }

    if (dateEmission) {
      dateEmission.start = dayjs(dateEmission.start).toDate();
      dateEmission.end = dayjs(dateEmission.end).toDate();
    }

    if (dueDate) {
      dueDate.start = dayjs(dueDate.start).toDate();
      dueDate.end = dayjs(dueDate.end).toDate();
    }

    if (prorogation) {
      prorogation.start = dayjs(prorogation.start).toDate();
      prorogation.end = dayjs(prorogation.end).toDate();
    }

    if (expectDate) {
      expectDate.start = dayjs(expectDate.start).toDate();
      expectDate.end = dayjs(expectDate.end).toDate();
    }

    const allPayment = [];
    // await this.financePaymentViewRepository.infoTableNoPage(
    //   query.type,
    //   {
    //     forEmission: query.forEmission,
    //     status,
    //     typePayment: query.typePayment,
    //     fiscalNumber: query.fiscalNumber
    //       ? Number(query.fiscalNumber)
    //       : undefined,
    //     dateEmission: query.dateEmission,
    //     issue: query.issue,
    //     sender: query.sender,
    //     dueDate: query.dueDate,
    //     prorogation: query.prorogation,
    //     expectDate: query.expectDate,
    //     totalItem: query.totalItem ? Number(query.totalItem) : undefined,
    //     valuePay: query.valueToPay ? Number(query.valueToPay) : undefined,
    //     valueToPay: query.valuePay ? Number(query.valuePay) : undefined,
    //   },
    // );

    const dataParam = {
      clientId: user.clientId,
      type: query.type,
      take: Number(query.perPage),
      skip: Number(query.index),
      forEmission: query.forEmission,
      status: query.status,
      typePayment: query.typePayment,
      fiscalNumber: queryResponse.fiscalNumber,
      dateEmission: query.dateEmission,
      issue: query.issue,
      sender: query.sender,
      dueDate: query.dueDate,
      prorogation: query.prorogation,
      expectDate: query.expectDate,
      totalItem: query.totalItem ? Number(query.totalItem) : undefined,
      valueToPay: query.valueToPay ? Number(query.valueToPay) : undefined,
      valuePay: query.valuePay ? Number(query.valuePay) : undefined,
    };

    const param = {};
    Object.entries(dataParam)
      .filter((v) => v[1] !== '')
      .forEach(([k, v]) => (param[k] = v));

    const table = await this.financePaymentViewRepository.infoTable(
      0,
      10,
      'pagar',
    );

    const data: infoTableResponse['rows'] = table.map((item) => {
      return {
        id: item.id,
        financeId: item.id_titulo,
        process: item.documento_numero,
        number: item.numero_fiscal,
        numberRequest: item.numero,
        dateEmission: item.data_emissao,
        issue: item.emitente,
        dueDate: item.vencimento,
        prorogation: item.prorrogacao,
        expectDate: item.data_vencimento,
        totalGross: item.totalItem,
        valuePay: item.valor_parcela,
        totalLiquid: item.valor_parcela,
        numberSplit: item.parcela,
        status: item.descricao,
      };
    });

    const response: infoTableResponse = {
      rows: data,
      pageCount: allPayment.length,
    };

    return response;
  }

  @UseGuards(AuthGuard)
  @Get('/list-status')
  async listStatus() {
    const status = await this.financeStatusRepository.list();

    return {
      data: status.map((item) => {
        return {
          value: item.id.toString(),
          label: item.descricao,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-type-document')
  async listTypeDocument(@Req() req) {
    const user: IUserInfo = req.user;

    const status = await this.financeTypeDocumentRepository.listByClient(
      user.clientId,
    );

    return {
      data: status.map((item) => {
        return {
          value: item.id.toString(),
          label: item.descricao,
          hasKey: item.requer_chave,
          autoFiscal: item.numeracao_automatica,
          maxValue: item.numberTypeDocument.length
            ? item.numberTypeDocument[item.numberTypeDocument.length - 1].numero
            : null,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-type-payment')
  async listTypePayment(@Req() req) {
    const user: IUserInfo = req.user;

    const payment = await this.financeTypePaymentRepository.listByClient(
      user.clientId,
    );

    return {
      data: payment.map((item) => {
        return {
          value: item.id.toString(),
          label: item.descricao,
          canSplit: Boolean(item.parcela),
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/find-emission')
  async findEmission(@Req() req, @Query() query: findEmissionBody) {
    //const user: IUserInfo = req.user;

    const response: findEmissionResponse = { group: [], withOut: [] };

    const allGroups = await this.financePaymentRepository.findByIds(
      query.splitId.map((item) => Number(item)),
    );

    for await (const payment of allGroups) {
      if (payment.emissionItem) {
        const { emission } = payment.emissionItem;

        const index = response.group.findIndex(
          (item) => item.id === emission.id,
        );

        if (index >= 0) {
          response.group[index].payment.push({
            id: payment.id,
            dueDate: payment.prorrogacao,
            provider: payment.finance.financeControl.senderPay.filial_numero,
            value: payment.valor_parcela,
          });
        } else {
          response.group.push({
            id: emission.id,
            pay: emission.pago === 1,
            dueDate: emission.data_vencimento,
            bankId: emission.id_banco,
            // bank: {
            //   id: emission.bank.id,
            //   name: emission.bank.nome,
            //   balance: emission.bank.saldo,
            // },
            payment: [
              {
                id: payment.id,
                dueDate: payment.prorrogacao,
                provider:
                  payment.finance.financeControl.senderPay.filial_numero,
                value: payment.valor_parcela,
              },
            ],
          });
        }
      } else {
        response.withOut.push({
          dueDate: payment.prorrogacao,
          provider: payment.finance.financeControl.senderPay.filial_numero,
          value: payment.valor_parcela,
        });
      }
    }

    return response;
  }

  @UseGuards(AuthGuard)
  @Get('/list-bank')
  async listBank(@Req() req) {
    const user: IUserInfo = req.user;

    const bank = await this.financeBankRepository.listByClient(user.clientId);

    return {
      bank: bank.map((item) => {
        return {
          id: item.id,
          name: item.nome,
          negative: item.negativo === 1,
          balance: item.saldo,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-taxation')
  async listTaxation(@Req() req) {
    const user: IUserInfo = req.user;

    const taxation = await this.financeTaxationRepository.findByClient(
      user.clientId,
    );

    return {
      data: taxation.map((item) => {
        return {
          label: item.descricao,
          value: item.id,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Post('/emission')
  async createEmission(@Req() req, @Body() body: CreateEmissionBody) {
    const user: IUserInfo = req.user;

    const bank = await this.financeBankRepository.findById(body.bankId);

    if (!bank) {
      throw new NotFoundException(MessageService.Finance_bank_id_not_found);
    }

    const sumPayment = await this.financePaymentRepository.sumSplit(
      body.splitId,
    );

    const balance =
      body.type === 'pagar' ? bank.saldo - sumPayment : bank.saldo + sumPayment;

    if (bank.negativo && balance < 0) {
      throw new UnauthorizedException(MessageService.Finance_bank_not_negative);
    }

    const emission = await this.emissionRepository.insert({
      id_cliente: user.clientId,
      id_banco: body.bankId,
      data_vencimento: body.dueDate,
      log_user: user.login,
      emissionItem: {
        createMany: {
          data: body.splitId.map((splitId) => {
            return {
              id_pagamento: splitId,
            };
          }),
        },
      },
    });

    return {
      inserted: true,
      data: emission,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/emission/:id')
  async updateEmission(
    @Param('id') id: number,
    @Body() body: UpdateEmissionBody,
  ) {
    const valid = await this.emissionRepository.findById(Number(id));

    if (!valid) {
      throw new NotFoundException(MessageService.Finance_emission_id_not_found);
    }

    if (valid.pago === 1) {
      throw new ForbiddenException(MessageService.Finance_emission_is_paid);
    }

    const bank = await this.financeBankRepository.findById(body.bankId);

    if (!bank) {
      throw new NotFoundException(MessageService.Finance_bank_id_not_found);
    }

    const emission = await this.emissionRepository.update(Number(id), {
      data_vencimento: body.dueDate,
      id_banco: body.bankId,
      pago: body.paid ? 1 : 0,
    });

    if (body.paid) {
      const sumPayment = emission.emissionItem.reduce((acc, item) => {
        return acc + item.installmentFinance.valor_parcela;
      }, 0);

      const balance =
        body.type === 'pagar'
          ? bank.saldo - sumPayment
          : bank.saldo + sumPayment;

      await this.financeBankTransactionRepository.insert({
        id_banco: bank.id,
        id_emissao: emission.id,
        data_lancamento: body.dueDate,
        tipo: body.type === 'pagar' ? 'SAIDA' : 'ENTRADA',
        valor: balance,
      });

      await this.financeBankRepository.update(bank.id, {
        saldo: balance,
      });

      for await (const emissionItem of emission.emissionItem) {
        await this.financePaymentRepository.update(emissionItem.id_pagamento, {
          status: 3,
        });
      }
    }

    return {
      data: emission,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/split/:id/taxation')
  async findTaxationForSplit(@Param('id') id: string) {
    const payment = await this.financePaymentRepository.findById(Number(id));

    if (!payment) {
      throw new NotFoundException(MessageService.Finance_paymentId_not_found);
    }

    const allTaxation =
      await this.financeEmissionTaxationRepository.listByPayment(payment.id);

    return {
      data: allTaxation.map((item) => {
        return {
          id: item.id,
          taxation: item.taxation.descricao,
          observation: item.observacao,
          value: item.valor,
          type: item.tipo,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Post('/split/:id/taxation')
  async insertTaxation(
    @Param('id') id: string,
    @Body() body: InsertTaxationBody,
  ) {
    const emission = await this.emissionRepository.findById(body.emissionId);

    if (!emission) {
      throw new NotFoundException(MessageService.Finance_emission_id_not_found);
    }

    if (emission.pago === 1) {
      throw new ForbiddenException(MessageService.Finance_emission_is_paid);
    }

    const payment = await this.financePaymentRepository.findById(Number(id));

    if (!payment) {
      throw new NotFoundException(MessageService.Finance_paymentId_not_found);
    }

    const taxation = await this.financeTaxationRepository.findById(
      body.taxation,
    );

    if (!taxation) {
      throw new NotFoundException(MessageService.Finance_taxationId_not_found);
    }

    const paymentTaxation = await this.financeEmissionTaxationRepository.insert(
      {
        id_atributo: taxation.id,
        id_emissao: emission.id,
        id_pagamento: payment.id,
        valor: body.value,
        observacao: body.description,
        tipo: body.type,
      },
    );

    let totalAddition = payment.acrescimo;
    let totalDiscount = payment.desconto;

    if (body.type === 'ACRESCIMO') {
      totalAddition += body.value;
    } else if (body.type === 'DESCONTO') {
      totalDiscount += body.value;
    }

    const valueSplit = totalAddition - totalDiscount;

    await this.financePaymentRepository.update(payment.id, {
      acrescimo: totalAddition,
      desconto: totalDiscount,
      valor_parcela: payment.valor_a_pagar + valueSplit,
    });

    return {
      inserted: true,
      data: paymentTaxation,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/split/:id/taxation/:taxationId')
  async deleteTaxation(
    @Param('id') id: string,
    @Param('taxationId') taxationId: string,
  ) {
    const payment = await this.financePaymentRepository.findById(Number(id));

    if (!payment) {
      throw new NotFoundException(MessageService.Finance_paymentId_not_found);
    }

    if (payment.emissionItem.emission.pago === 1) {
      throw new ForbiddenException(MessageService.Finance_emission_is_paid);
    }

    const taxation = await this.financeEmissionTaxationRepository.findById(
      Number(taxationId),
    );

    if (!taxation) {
      throw new NotFoundException(MessageService.Finance_taxationId_not_found);
    }

    await this.financeEmissionTaxationRepository.delete(taxation.id);

    let totalAddition = payment.acrescimo;
    let totalDiscount = payment.desconto;

    if (payment.finance.direcao === 'pagar') {
      totalAddition -= taxation.valor;
    } else {
      totalDiscount -= taxation.valor;
    }

    const valueSplit = totalAddition - totalDiscount + payment.valor_a_pagar;

    await this.financePaymentRepository.update(payment.id, {
      valor_parcela: valueSplit,
    });

    return {
      deleted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/split/:id')
  async deletePaymentInEmission(@Param('id') id: string) {
    const payment = await this.financePaymentRepository.findById(Number(id));

    if (!payment) {
      throw new NotFoundException(MessageService.Finance_paymentId_not_found);
    }

    if (payment.emissionItem) {
      const { emission } = payment.emissionItem;

      await this.financeEmissionItemRepository.deleteForPayment(payment.id);

      await this.financeBankTransactionRepository.insert({
        id_banco: emission.bank.id,
        id_emissao: emission.id,
        valor: payment.valor_parcela,
        tipo: payment.finance.direcao === 'pagar' ? 'ESTORNO' : 'REEMBOLSO',
      });

      await this.financeBankRepository.update(emission.bank.id, {
        saldo:
          payment.finance.direcao === 'pagar'
            ? emission.bank.saldo + payment.valor_parcela
            : emission.bank.saldo - payment.valor_parcela,
      });

      const newEmission = await this.emissionRepository.findById(emission.id);

      if (newEmission.emissionItem.length === 0) {
        await this.emissionRepository.delete(emission.id);
      }
    } else {
      throw new NotFoundException(MessageService.Finance_emission_id_not_found);
    }

    return {
      deleted: true,
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Get('/list-branch')
  async listBranch(@Req() req) {
    const user: IUserInfo = req.user;

    const branch = await this.branchRepository.listByIds(user.branches);

    return {
      data: branch.map((item) => {
        return {
          value: item.ID.toString(),
          label: item.filial_numero,
        };
      }),
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Get('/list-provider')
  async listProvider(@Req() req) {
    const user: IUserInfo = req.user;

    const provider = await this.providerRepository.listByClient(user.clientId);

    return {
      data: provider.map((item) => {
        return {
          value: item.ID.toString(),
          label: item.razao_social,
        };
      }),
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Get('/finance/list')
  async listFinanceInOpen(@Req() req, @Query() query: ListFinanceQuery) {
    const user: IUserInfo = req.user;

    const allFinance = await this.financeRepository.listByClientAndStatus(
      user.clientId,
      query.type,
      'ABERTO',
    );

    return {
      data: allFinance.map((finance) => {
        return {
          id: finance.id,
          numberFiscal: finance.numero_fiscal,
          numberProcess: finance.documento_numero,
          emissionDate: finance.data_emissao,
          issue: finance.financeControl.issuePay
            ? finance.financeControl.issuePay.razao_social
            : finance.financeControl.issueReceive.filial_numero,
          sender: finance.financeControl.senderPay
            ? finance.financeControl.senderPay.filial_numero
            : finance.financeControl.senderReceive.razao_social,
        };
      }),
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Get('/finance/filter')
  async findFinanceByFilter(@Req() req, @Query() query) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      type: z.enum(['pagar', 'receber']),
      documentType: z.coerce.number().optional(),
      fiscalNumber: z.coerce
        .number()
        .transform((value) => value.toString())
        .optional(),
      issuer: z.coerce.number().optional(),
      sender: z.coerce.number().optional(),
      emissionDate: z.coerce.date().optional(),
    });

    const { emissionDate, issuer, sender, type, fiscalNumber, documentType } =
      querySchema.parse(query);

    const allFinance = await this.financeRepository.listByFilterDynamic({
      id_cliente: user.clientId,
      direcao: type,
      AND: {
        OR: [
          {
            data_emissao: emissionDate ? emissionDate : {},
          },
          {
            financeControl: {
              emitente_pagar: issuer || null,
              emitente_receber: issuer || null,
              remetente_pagar: sender || null,
              remetente_receber: sender || null,
            },
          },
          {
            documento_tipo: documentType ? documentType : {},
          },
          {
            numero_fiscal: fiscalNumber
              ? {
                  contains: fiscalNumber,
                }
              : {
                  not: null,
                },
          },
        ],
      },
    });

    return {
      data: allFinance.map((finance) => {
        return {
          id: finance.id,
          numberFiscal: finance.numero_fiscal,
          numberProcess: finance.documento_numero,
          emissionDate: finance.data_emissao,
          issuer: finance.financeControl.issuePay
            ? finance.financeControl.issuePay.razao_social
            : finance.financeControl.issueReceive.filial_numero,
          sender: finance.financeControl.senderPay
            ? finance.financeControl.senderPay.filial_numero
            : finance.financeControl.senderReceive.razao_social,
        };
      }),
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Get('/finance/not-control')
  async control(@Req() req) {
    const user: IUserInfo = req.user;

    const allFinance = await this.financeRepository.findByNotControl(
      user.clientId,
      'receber',
    );

    for await (const finance of allFinance) {
      const control = await this.financeControlRepository.insert({
        emitente_pagar: finance.direcao === 'pagar' ? finance.emitente : null,
        remetente_pagar: finance.direcao === 'pagar' ? finance.remetente : null,
        emitente_receber:
          finance.direcao === 'receber' ? finance.emitente : null,
        remetente_receber:
          finance.direcao === 'receber' ? finance.remetente : null,
      });

      await this.financeRepository.update(finance.id, {
        id_controle: control.id,
      });

      const allItem = await this.financeItemRepository.findByTitleNotDefault(
        finance.id,
      );

      for await (const item of allItem) {
        if (finance.direcao === 'pagar') {
          const material = await this.materialRepository.findById(
            item.id_insumo,
          );

          if (!material) {
            throw new NotFoundException('material nao encontrado!');
          }

          await this.financeItemRepository.update(item.id, {
            id_material: material.id,
            //id_insumo: null
          });

          const equipment = await this.equipmentRepository.findById(
            item.id_equipamento || 0,
          );

          const order = await this.orderRepository.findById(item.id_os || 0);

          if (item.vinculo !== 'EMPTY' && item.vinculo !== 'STOCK')
            await this.financeItemBoundRepository.insert({
              id_item: item.id,
              log_user: item.log_user,
              id_equipamento: equipment?.ID || null,
              id_os: order?.ID || null,
            });
        } else if (finance.direcao === 'receber') {
          const input = await this.contractTypeInputRepository.findById(
            item.id_insumo,
          );

          if (!input) {
            throw new NotFoundException('insumo nao encontrado!');
          }

          await this.financeItemRepository.update(item.id, {
            id_insumo: input.id,
            //id_material: null
          });

          const equipment = await this.equipmentRepository.findById(
            item.id_equipamento || 0,
          );

          const order = await this.orderRepository.findById(item.id_os || 0);

          if (item.vinculo !== 'EMPTY' && item.vinculo !== 'STOCK')
            await this.financeItemBoundRepository.insert({
              id_item: item.id,
              log_user: item.log_user,
              id_equipamento: equipment?.ID || null,
              id_os: order?.ID || null,
            });
        }
      }
    }

    return {
      data: allFinance,
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Post('/finance')
  async insertFinance(@Req() req, @Body() body: InsertFinanceBody) {
    const user: IUserInfo = req.user;

    const typeDocument = await this.financeTypeDocumentRepository.findById(
      body.typeDocument,
    );

    if (!typeDocument) {
      throw new NotFoundException(
        MessageService.Finance_typeDocument_not_found,
      );
    }

    const validFinance = await this.financeRepository.findIfExist(
      typeDocument.id,
      body.issue,
      body.sender,
      body.numberFiscal.toString(),
      body.type,
    );

    if (validFinance) {
      throw new ConflictException({
        message: MessageService.Finance_duplicate,
        data: validFinance,
      });
    }

    if (body.type === 'pagar') {
      const issue = await this.providerRepository.findById(body.issue);

      if (!issue) {
        throw new NotFoundException(MessageService.Finance_issue_not_found);
      }

      const sender = await this.branchRepository.findById(body.sender);

      if (!sender) {
        throw new NotFoundException(MessageService.Finance_sender_not_found);
      }

      if (typeDocument.requer_chave && body.key.length === 0) {
        throw new NotFoundException(MessageService.Finance_key_not_found);
      }

      const lastNumberProcess =
        await this.financeNumberRepository.findLastNumber(user.clientId);

      await this.financeControlRepository.insert({
        emitente_pagar: body.type === 'pagar' ? issue.ID : null,
        remetente_pagar: body.type === 'pagar' ? sender.ID : null,
        finance: {
          create: {
            direcao: body.type,
            id_cliente: user.clientId,
            documento_numero: (lastNumberProcess + 1).toString(),
            id_documento_tipo: typeDocument.id,
            data_emissao: dayjs(body.dateEmission).toDate(),
            data_lancamento: dayjs(body.dateEmission).toDate(),
            emitente: body.issue,
            remetente: body.sender,
            id_filial: body.sender,
            id_filial_pagador: 0,
            id_fornecedor: 0,
            chave: body.key,
            descricao: body.observation,
            log_user: user.login,
            numero_fiscal: body.numberFiscal.toString(),
            total_acrescimo: 0,
            total_desconto: 0,
            numberFinance: {
              create: {
                id_cliente: user.clientId,
                numero: lastNumberProcess + 1,
              },
            },
          },
        },
      });

      const finance = await this.financeRepository.findLast(user.clientId);

      await this.financeNumberTypeDocumentRepository.insert({
        id_cliente: user.clientId,
        id_tipo_documento: typeDocument.id,
        numero: body.numberFiscal,
      });

      await this.logFinance(finance, user, 'INSERT');

      return {
        data: finance,
        inserted: true,
      };
    } else {
      const issue = await this.branchRepository.findById(body.issue);

      if (!issue) {
        throw new NotFoundException(MessageService.Finance_issue_not_found);
      }

      const sender = await this.providerRepository.findById(body.sender);

      if (!sender) {
        throw new NotFoundException(MessageService.Finance_sender_not_found);
      }

      const lastNumberProcess =
        await this.financeNumberRepository.findLastNumber(user.clientId);

      await this.financeControlRepository.insert({
        emitente_receber: body.type === 'receber' ? issue.ID : null,
        remetente_receber: body.type === 'receber' ? sender.ID : null,
        finance: {
          create: {
            direcao: body.type,
            id_cliente: user.clientId,
            documento_numero: (lastNumberProcess + 1).toString(),
            id_documento_tipo: typeDocument.id,
            data_emissao: dayjs(body.dateEmission).toDate(),
            data_lancamento: dayjs(body.dateEmission).toDate(),
            emitente: body.issue,
            remetente: body.sender,
            id_filial: body.issue,
            id_filial_pagador: 0,
            id_fornecedor: 0,
            chave: body.key,
            descricao: body.observation,
            log_user: user.login,
            numero_fiscal: body.numberFiscal.toString(),
            numberFinance: {
              create: {
                id_cliente: user.clientId,
                numero: lastNumberProcess + 1,
              },
            },
          },
        },
      });

      const finance = await this.financeRepository.findLast(user.clientId);

      await this.financeNumberTypeDocumentRepository.insert({
        id_cliente: user.clientId,
        id_tipo_documento: typeDocument.id,
        numero: body.numberFiscal,
      });

      await this.logFinance(finance, user, 'INSERT');

      return {
        data: finance,
        inserted: true,
      };
    }
  }

  async logFinance(
    finance: IFinancePrisma,
    user: IUserInfo,
    action: 'INSERT' | 'UPDATE' | 'DELETE',
  ): Promise<boolean> {
    await this.logFinanceRepository.insert({
      id_financeiro: finance.id,
      acao: action,
      id_cliente: finance.id_cliente,
      id_filial: finance.id_filial,
      id_documento_tipo: finance.id_documento_tipo,
      direcao: finance.direcao,
      id_fornecedor: finance.id_fornecedor,
      id_filial_pagador: finance.id_filial_pagador,
      descricao: finance.descricao,
      documento_numero: finance.documento_numero,
      numero_fiscal: finance.numero_fiscal,
      documento_tipo: finance.documento_tipo,
      frequencia_pagamento: finance.frequencia_pagamento,
      documento_valor: finance.documento_valor,
      parcelar: finance.parcelar,
      quantidade_parcela: finance.quantidade_parcela,
      data_vencimento: finance.data_vencimento,
      observacoes: finance.observacoes,
      log_date: finance.log_date,
      log_user: finance.log_user,
      data_emissao: finance.data_emissao,
      data_lancamento: finance.data_lancamento,
      emitente: finance.emitente,
      remetente: finance.remetente,
      chave: finance.chave,
      status: finance.status,
      total_acrescimo: finance.total_acrescimo,
      total_desconto: finance.total_desconto,
      acrescimo_desconto: finance.acrescimo_desconto,
      total_liquido: finance.total_liquido,
      date_log: finance.log_date,
      user_log: user.login,
    });

    return true;
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Get('/finance/:id/attach')
  async listAttach(@Param('id') id: string) {
    try {
      const finance = await this.financeRepository.findById(Number(id));

      if (!finance) {
        throw new NotFoundException(MessageService.Finance_not_found);
      }

      let URLSYSTEM = `https:/smartnewsystem.com.br/homolog/_lib/img/testeFinanceiro/id_${finance.id}`;
      let URLPATH = `/www/homolog/_lib/img/testeFinanceiro/id_${finance.id}`;

      if (this.envService.NODE_ENV === 'production') {
        URLSYSTEM = `https:/sistemas.smartnewsystem.com.br/sistemas/_lib/img/financeiro/id_${finance.id}`;
        URLPATH = `/www/sistemas/_lib/img/financeiro/id_${finance.id}`;
      }

      const client = await this.ftpService.connect();

      await this.ftpService.changeDir(client, `${URLPATH}`);

      const img: {
        url: string;
      }[] = [];

      const listImg = await client.list();

      listImg.forEach((fileItem) => {
        img.push({
          url: `${URLSYSTEM}/${fileItem.name}`,
        });
      });

      await this.ftpService.close(client);

      return {
        data: img,
      };
    } catch (error) {
      console.log(error);
      return {
        error,
        message: MessageService.SYSTEM_FTP_IMG_ERROR_CONNECT,
      };
    }
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Post('/finance/:id/attach')
  @UseInterceptors(FileInterceptor('file'))
  async insertAttach(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const finance = await this.financeRepository.findById(Number(id));

      if (!finance) {
        throw new NotFoundException(MessageService.Finance_not_found);
      }

      let URLPATH = `/www/homolog/_lib/img/testeFinanceiro/id_${finance.id}`;

      if (this.envService.NODE_ENV === 'production') {
        URLPATH = `/www/sistemas/_lib/img/financeiro/id_${finance.id}`;
      }

      const client = await this.ftpService.connect();

      await this.ftpService.changeDir(client, URLPATH);

      await this.ftpService.insertFile(client, URLPATH, file);

      this.ftpService.close(client);

      return {
        inserted: true,
      };
    } catch (error) {
      console.log(error);
      return {
        error,
        message: MessageService.SYSTEM_FTP_IMG_ERROR_CONNECT,
      };
    }
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Delete('/finance/:id/attach')
  @UseInterceptors(FileInterceptor('file'))
  async deleteAttach(@Param('id') id: string, @Body() body: deleteAttachBody) {
    try {
      const finance = await this.financeRepository.findById(Number(id));

      if (!finance) {
        throw new NotFoundException(MessageService.Finance_not_found);
      }

      const client = await this.ftpService.connect();

      let URLPATH = `/www/homolog/_lib/img/testeFinanceiro/id_${finance.id}`;

      if (this.envService.NODE_ENV === 'production') {
        URLPATH = `/www/sistemas/_lib/img/financeiro/id_${finance.id}`;
      }

      await this.ftpService.deleteFile(client, `${URLPATH}/${body.file}`);

      this.ftpService.close(client);

      return {
        deleted: true,
      };
    } catch (error) {
      if (error.code === 550) {
        return {
          message: MessageService.SYSTEM_FTP_FILE_DELETE_NOT_EXISTS,
        };
      } else
        return {
          error,
          message: MessageService.SYSTEM_FTP_IMG_ERROR_CONNECT,
        };
    }
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Post('/finance/:id/duplicate')
  async duplicateFinance(
    @Param('id') id: string,
    @Body() body: DuplicateFinanceBody,
  ) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const lastNumberProcess = await this.financeNumberRepository.findLastNumber(
      finance.id_cliente,
    );

    const exists = await this.financeRepository.findIfExist(
      finance.documentType.id,
      finance.direcao === 'pagar'
        ? finance.financeControl.issuePay.ID
        : finance.financeControl.issueReceive.ID,
      finance.direcao === 'pagar'
        ? finance.financeControl.senderPay.ID
        : finance.financeControl.senderReceive.ID,
      body.fiscalNumber.toString(),
      finance.direcao,
    );

    if (exists) {
      throw new NotFoundException(MessageService.Finance_duplicate);
    }

    await this.financeControlRepository.insert({
      emitente_pagar: finance.financeControl.issuePay?.ID || null,
      remetente_pagar: finance.financeControl.senderPay?.ID || null,
      emitente_receber: finance.financeControl.issueReceive?.ID || null,
      remetente_receber: finance.financeControl.senderReceive?.ID || null,
      finance: {
        create: {
          direcao: finance.direcao,
          id_cliente: finance.id_cliente,
          documento_numero: (lastNumberProcess + 1).toString(),
          id_documento_tipo: finance.documentType.id,
          data_emissao: finance.data_emissao,
          data_lancamento: finance.data_lancamento,
          emitente:
            finance.direcao === 'pagar'
              ? finance.financeControl.issuePay.ID
              : finance.financeControl.issueReceive.ID,
          remetente:
            finance.direcao === 'pagar'
              ? finance.financeControl.senderPay.ID
              : finance.financeControl.senderReceive.ID,
          id_filial: finance.id_filial,
          id_filial_pagador: 0,
          id_fornecedor: 0,
          chave: finance.chave,
          descricao: finance.descricao,
          log_user: finance.log_user,
          numero_fiscal: body.fiscalNumber.toString(),
          total_acrescimo: finance.total_acrescimo,
          total_desconto: finance.total_desconto,
          numberFinance: {
            create: {
              id_cliente: finance.id_cliente,
              numero: lastNumberProcess + 1,
            },
          },
          quantidade_parcela: finance.quantidade_parcela,
          frequencia_fixa: finance.frequencia_fixa,
          frequencia_pagamento: finance.frequencia_pagamento,
          acrescimo_desconto: finance.acrescimo_desconto,
          data_vencimento: finance.data_vencimento,
          documento_tipo: finance.paymentType.id,
          documento_valor: finance.documento_valor,
          parcelar: finance.parcelar,
          total_liquido: finance.total_liquido,
        },
      },
    });

    const newFinance = await this.financeRepository.findLast(
      finance.id_cliente,
    );

    try {
      const allItems = await this.financeItemRepository.findByTitle(finance.id);

      for await (const item of allItems) {
        await this.financeItemRepository.insert({
          id_titulo: newFinance.id,
          id_item_centro_custo: item.compositionItem.id,
          log_user: finance.log_user,
          id_insumo: item.input?.id || null,
          id_material: item.material?.id || null,
          item: item.item,
          preco_unitario: item.preco_unitario,
          quantidade: item.quantidade,
          total: item.total,
          vinculo: item.vinculo,
          financeBound: {
            createMany: {
              data: item.financeBound.map((bound) => {
                return {
                  log_user: finance.log_user,
                  id_equipamento: bound?.equipment?.ID || null,
                  id_os: bound?.order?.ID || null,
                };
              }),
            },
          },
        });
      }

      const allRegister =
        await this.financeRegisterTributeRepository.findByFinance(finance.id);

      for await (const register of allRegister) {
        await this.financeRegisterTributeRepository.create({
          id_titulo: newFinance.id,
          descricao: register.descricao,
          id_tributo: register.tribute.id,
          valor: register.valor,
          tipo: register.tipo,
        });
      }

      const allInstallment = await this.financePaymentRepository.findByFinance(
        finance.id,
      );

      for await (const installment of allInstallment) {
        await this.financePaymentRepository.create({
          id_titulo: newFinance.id,
          parcela: installment.parcela,
          valor_parcela: installment.valor_a_pagar,
          vencimento: installment.vencimento,
          valor_a_pagar: installment.valor_a_pagar,
        });
      }
    } catch (error) {
      console.log(error);
      await this.financeItemRepository.deleteByFinance(newFinance.id);

      await this.financeRegisterTributeRepository.deleteByFinance(
        newFinance.id,
      );

      await this.financePaymentRepository.deleteByFinance(newFinance.id);

      await this.financeRepository.delete(newFinance.id);

      return {
        inserted: false,
        error,
      };
    }

    return {
      inserted: true,
      id: newFinance.id,
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Put('/finance/:id')
  async updateFinance(
    @Param('id') id: string,
    @Body() body: UpdateFinanceBody,
  ) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    await this.financeRepository.update(finance.id, {
      descricao: body.observation,
    });

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Get('/finance/:id')
  async findFinance(@Param('id') id: string) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const response: FindFinanceResponse = {
      id: finance.id,
      documentType: finance.documentType.descricao,
      direction: finance.direcao,
      processNumber: Number(finance.documento_numero),
      fiscalNumber: Number(finance.numero_fiscal),
      description: finance.descricao,
      //observation: finance.observacao,
      paymentType: finance.paymentType?.descricao,
      frequencyPay: Boolean(finance.frequencia_pagamento),
      total: finance.documento_valor,
      split: finance.parcelar,
      quantitySplit: finance.quantidade_parcela,
      dueDate: finance.data_vencimento,
      dateEmission: finance.data_emissao,
      dateLaunch: finance.data_lancamento,
      issue:
        finance.direcao === 'pagar'
          ? finance.financeControl.issuePay.razao_social
          : finance.financeControl.issueReceive.filial_numero,
      sender:
        finance.direcao === 'pagar'
          ? finance.financeControl.senderPay.filial_numero
          : finance.financeControl.senderReceive.razao_social,
      key: finance.chave,
      status: finance.status,
      additionTotal: finance.total_acrescimo,
      discountTotal: finance.total_desconto,
      additionDiscount: finance.acrescimo_desconto,
      liquidTotal: finance.total_liquido,
      editable: !finance.installmentFinance.some((split) => split.status === 3),
    };

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Delete('/finance/:id')
  async deleteFinance(@Param('id') id: string) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const allInstallment = await this.financePaymentRepository.findByFinance(
      finance.id,
    );

    if (allInstallment.some((split) => split.status === 3)) {
      throw new NotFoundException(MessageService.Finance_not_delete_split);
    }

    await this.financeItemRepository.deleteByFinance(finance.id);

    await this.financeRegisterTributeRepository.deleteByFinance(finance.id);

    await this.financePaymentRepository.deleteByFinance(finance.id);

    await this.financeRepository.delete(finance.id);

    return {
      deleted: true,
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Get('/list-order')
  async listOrder(@Req() req) {
    const user: IUserInfo = req.user;

    const order = await this.orderRepository.listByBranch(user.branches);

    return {
      data: order.map((item) => {
        return {
          value: item.ID.toString(),
          label: `${item.ordem} - ${item.equipment.descricao}`,
        };
      }),
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Get('/list-equipment')
  async listEquipment(@Req() req) {
    const user: IUserInfo = req.user;

    const equipment = await this.equipmentRepository.listByBranch(
      user.branches,
    );

    return {
      data: equipment.map((item) => {
        return {
          value: item.ID.toString(),
          label: `${item.equipamento_codigo} - ${item.descricao}`,
        };
      }),
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Get('/list-input')
  async listInput(@Req() req) {
    const user: IUserInfo = req.user;

    const input = await this.contractTypeInputRepository.listByClient(
      user.clientId,
    );

    return {
      data: input.map((item) => {
        return {
          value: item.id.toString(),
          label: item.insumo,
        };
      }),
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Get('/list-material')
  async listMaterial(@Req() req) {
    const user: IUserInfo = req.user;

    const input = await this.materialRepository.listByClient(user.clientId);

    return {
      data: input.map((item) => {
        return {
          value: item.id.toString(),
          label: `${item.codigo} - ${item.material}`,
        };
      }),
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Get('/finance/:id/item')
  async listItem(@Param('id') id: string) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const items = await this.financeItemRepository.findByTitle(Number(id));

    return {
      data: items.map((value) => {
        return {
          id: value.id,
          item: value.item,
          total: value.total,
          bound: value.vinculo,
          costCenter: `${value.compositionItem.compositionGroup.costCenter.centro_custo} - ${value.compositionItem.compositionGroup.costCenter.descricao}`,
          compositionItem: {
            value: value.compositionItem.id.toString(),
            label: `${value.compositionItem.composicao} - ${value.compositionItem.descricao}`,
          },
          input:
            value.finance.direcao === 'pagar'
              ? null
              : {
                  value: value.input.id.toString(),
                  label: value.input.insumo,
                },
          material:
            value.finance.direcao === 'pagar'
              ? {
                  value: value.material.id.toString(),
                  label: value.material.material,
                }
              : null,
          equipment: value.financeBound
            .filter((item) => item.equipment)
            .map((bound) => {
              return {
                value: bound.equipment.ID.toString(),
                label: bound.equipment.descricao,
              };
            }),
          order: value.financeBound
            .filter((item) => item.order)
            .map((bound) => {
              return {
                value: bound.order.ID.toString(),
                label: `${bound.order.ordem} - ${bound.order.equipment.equipamento_codigo} - ${bound.order.equipment.descricao}`,
              };
            }),
          quantity: value.quantidade,
          price: value.preco_unitario,
        };
      }),
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Post('/finance/:id/item')
  async createItem(
    @Param('id') id: string,
    @Req() req,
    @Body() body: CreateItemBody,
  ) {
    const user: IUserInfo = req.user;

    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const countItem = await this.financeItemRepository.countItem(Number(id));

    const item = await this.financeItemRepository.insert({
      id_insumo: finance.direcao === 'receber' ? body.inputId : null,
      id_material: finance.direcao === 'pagar' ? body.inputId : null,
      item: (countItem + 1).toString(),
      id_item_centro_custo: body.compositionItemId,
      id_titulo: Number(id),
      log_user: user.login,
      quantidade: body.quantity,
      preco_unitario: body.price,
      vinculo: body.bound || null,
      total: body.quantity * body.price,
    });

    if (body.equipment) {
      for await (const equipmentId of body.equipment) {
        await this.financeItemBoundRepository.insert({
          id_item: item.id,
          id_equipamento: Number(equipmentId),
          id_os: null,
          log_user: user.login,
        });
      }
    }

    if (body.order) {
      for await (const orderId of body.order) {
        await this.financeItemBoundRepository.insert({
          id_item: item.id,
          id_equipamento: null,
          id_os: Number(orderId),
          log_user: user.login,
        });
      }
    }

    const total = finance.documento_valor + body.quantity * body.price;
    const taxationFinance =
      (finance.total_acrescimo || 0) - (finance.total_desconto || 0);
    const totalLiquid = taxationFinance + total;

    await this.financeRepository.update(finance.id, {
      documento_valor: total,
      total_liquido: totalLiquid,
    });

    const newItem = await this.financeItemRepository.findById(item.id);

    return {
      inserted: true,
      item: {
        id: newItem.id,
        item: newItem.item,
        total: newItem.total,
        bound: newItem.vinculo,
        costCenter: `${newItem.compositionItem.compositionGroup.costCenter.centro_custo} - ${newItem.compositionItem.compositionGroup.costCenter.descricao}`,
        compositionItem: {
          value: newItem.compositionItem.id,
          label: `${newItem.compositionItem.composicao} - ${newItem.compositionItem.descricao}`,
        },
        input:
          newItem.finance.direcao === 'pagar'
            ? null
            : {
                value: newItem.input.id,
                label: newItem.input.insumo,
              },
        material:
          newItem.finance.direcao === 'pagar'
            ? {
                value: newItem.material.id,
                label: newItem.material.material,
              }
            : null,
        equipment: newItem.financeBound
          .filter((item) => item.equipment)
          .map((bound) => {
            return {
              value: bound.equipment.ID,
              label: bound.equipment.descricao,
            };
          }),
        order: newItem.financeBound
          .filter((item) => item.order)
          .map((bound) => {
            return {
              value: bound.order.ID,
              label: `${bound.order.ordem} - ${bound.order.equipment.equipamento_codigo} - ${bound.order.equipment.descricao}`,
            };
          }),
        quantity: newItem.quantidade,
        price: newItem.preco_unitario,
      },
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Put('/finance/:id/item/:itemId')
  async updateItem(
    @Req() req,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() body: UpdateItemBody,
  ) {
    type InsertBound = {
      id_equipamento: number | null;
      id_os: number | null;
      log_user: string;
    };

    const user: IUserInfo = req.user;

    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const item = await this.financeItemRepository.findById(Number(itemId));

    if (!item) {
      throw new NotFoundException(MessageService.FinanceItem_not_found);
    }

    let newItemsArrayEquipment: InsertBound[] = [];
    let itemsToRemoveArrayEquipment: number[] = [];

    let newItemsArrayOrder: InsertBound[] = [];
    let itemsToRemoveArrayOrder: number[] = [];

    if (body.equipment) {
      const allEquipment =
        item.financeBound.filter((value) => value.equipment).length > 0
          ? item.financeBound.map((item) => item.equipment.ID)
          : [];

      const newItemsEquipment = body.equipment.filter(
        (values) => !allEquipment.includes(Number(values)),
      );

      newItemsArrayEquipment = newItemsEquipment.map((equipmentId) => {
        return {
          id_os: null,
          id_equipamento: Number(equipmentId),
          log_user: user.login,
        };
      });

      const itemsToRemoveEquipment = allEquipment.filter(
        (item) => !body.equipment.includes(item.toString()),
      );

      itemsToRemoveArrayEquipment = [...itemsToRemoveEquipment];
    }

    if (body.order) {
      const allOrder =
        item.financeBound.filter((value) => value.order).length > 0
          ? item.financeBound.map((item) => item.order.ID)
          : [];

      const newItemsOrder = body.order.filter(
        (values) => !allOrder.includes(Number(values)),
      );

      newItemsArrayOrder = newItemsOrder.map((orderId) => {
        return {
          id_equipamento: null,
          id_os: Number(orderId),
          log_user: user.login,
        };
      });

      const itemsToRemoveOrder = allOrder.filter(
        (item) => !body.order.includes(item.toString()),
      );

      itemsToRemoveArrayOrder = [...itemsToRemoveOrder];
    }

    const newsItemsArray = newItemsArrayEquipment.concat(newItemsArrayOrder);

    await this.financeItemRepository.update(item.id, {
      id_insumo: item.finance.direcao === 'receber' ? body.inputId : null,
      id_material: item.finance.direcao === 'pagar' ? body.inputId : null,
      id_item_centro_custo: body.compositionItemId,
      preco_unitario: body.price,
      quantidade: body.quantity,
      total: body.quantity * body.price,
      financeBound: {
        createMany: {
          data: newsItemsArray,
        },
        deleteMany: [
          {
            id_equipamento: {
              in: itemsToRemoveArrayEquipment,
            },
            id_item: item.id,
          },
          {
            id_os: {
              in: itemsToRemoveArrayOrder,
            },
            id_item: item.id,
          },
        ],
      },
    });

    const total = finance.documento_valor + body.quantity * body.price;
    const taxationFinance =
      (finance.total_acrescimo || 0) - (finance.total_desconto || 0);
    const totalLiquid = taxationFinance + total;

    await this.financeRepository.update(finance.id, {
      documento_valor: total,
      total_liquido: totalLiquid,
    });

    const newItem = await this.financeItemRepository.findById(item.id);

    return {
      updated: true,
      item: {
        id: newItem.id,
        item: newItem.item,
        total: newItem.total,
        bound: newItem.vinculo,
        costCenter: `${newItem.compositionItem.compositionGroup.costCenter.centro_custo} - ${newItem.compositionItem.compositionGroup.costCenter.descricao}`,
        compositionItem: {
          value: newItem.compositionItem.id,
          label: `${newItem.compositionItem.composicao} - ${newItem.compositionItem.descricao}`,
        },
        input:
          newItem.finance.direcao === 'pagar'
            ? null
            : {
                value: newItem.input.id,
                label: newItem.input.insumo,
              },
        material:
          newItem.finance.direcao === 'pagar'
            ? {
                value: newItem.material.id,
                label: newItem.material.material,
              }
            : null,
        equipment: newItem.financeBound
          .filter((item) => item.equipment)
          .map((bound) => {
            return {
              value: bound.equipment.ID,
              label: bound.equipment.descricao,
            };
          }),
        order: newItem.financeBound
          .filter((item) => item.order)
          .map((bound) => {
            return {
              value: bound.order.ID,
              label: `${bound.order.ordem} - ${bound.order.equipment.equipamento_codigo} - ${bound.order.equipment.descricao}`,
            };
          }),
        quantity: newItem.quantidade,
        price: newItem.preco_unitario,
      },
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Delete('/finance/:id/item/:itemId')
  async deleteItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const item = await this.financeItemRepository.findById(Number(itemId));

    if (!item) {
      throw new NotFoundException(MessageService.FinanceItem_not_found);
    }

    await this.financeItemRepository.delete(Number(itemId));

    const total = finance.documento_valor - Number(item.total);
    const taxationFinance =
      (finance.total_acrescimo || 0) - (finance.total_desconto || 0);
    const totalLiquid = taxationFinance + total;

    await this.financeRepository.update(finance.id, {
      documento_valor: total,
      total_liquido: totalLiquid,
    });

    return {
      deleted: true,
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Get('/finance/:id/register')
  async findRegisterByFinance(@Param('id') id: string) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const allRegister =
      await this.financeRegisterTributeRepository.findByFinance(finance.id);

    return {
      data: allRegister.map((register) => {
        return {
          id: register.id,
          observation: register.descricao,
          type: register.tipo,
          value: register.valor,
          tribute: register.tribute.descricao,
        };
      }),
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Post('/finance/:id/register')
  async insertRegister(
    @Param('id') id: string,
    @Body() body: InsertRegisterBody,
  ) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const tribute = await this.financeTaxationRepository.findById(
      body.tributeId,
    );

    if (!tribute) {
      throw new NotFoundException(MessageService.Finance_taxationId_not_found);
    }

    await this.financeRegisterTributeRepository.create({
      id_titulo: finance.id,
      id_tributo: tribute.id,
      valor: body.value,
      descricao: body.description,
      tipo: body.type,
    });

    let totalAddition = finance.total_acrescimo;
    let totalDiscount = finance.total_desconto;

    if (body.type === 'ACRESCIMO') {
      totalAddition += body.value;
    } else {
      totalDiscount += body.value;
    }

    const totalAdditionDiscount = totalAddition - totalDiscount;

    const totalLiquid = finance.documento_valor + totalAdditionDiscount;

    await this.financeRepository.update(finance.id, {
      total_acrescimo: totalAddition,
      total_desconto: totalDiscount,
      acrescimo_desconto: totalAdditionDiscount,
      total_liquido: totalLiquid,
    });

    return {
      inserted: true,
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Put('/finance/:id/register/:registerId')
  async updateRegister(
    @Param('id') id: string,
    @Param('registerId') registerId: string,
    @Body() body: UpdateRegisterBody,
  ) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const register = await this.financeRegisterTributeRepository.findById(
      Number(registerId),
    );

    if (!register) {
      throw new NotFoundException(MessageService.Finance_registerId_not_found);
    }

    const tribute = await this.financeTaxationRepository.findById(
      body.tributeId,
    );

    if (!tribute) {
      throw new NotFoundException(MessageService.Finance_taxationId_not_found);
    }

    await this.financeRegisterTributeRepository.update(register.id, {
      id_tributo: tribute.id,
      valor: body.value,
      descricao: body.description,
      tipo: body.type,
    });

    const totalAddition =
      await this.financeRegisterTributeRepository.sumFinanceAndType(
        finance.id,
        'ACRESCIMO',
      );
    const totalDiscount =
      await this.financeRegisterTributeRepository.sumFinanceAndType(
        finance.id,
        'DESCONTO',
      );

    const totalAdditionDiscount = totalAddition - totalDiscount;

    const totalLiquid = finance.documento_valor + totalAdditionDiscount;

    await this.financeRepository.update(finance.id, {
      total_acrescimo: totalAddition,
      total_desconto: totalDiscount,
      acrescimo_desconto: totalAdditionDiscount,
      total_liquido: totalLiquid,
    });

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Delete('/finance/:id/register/:registerId')
  async deleteRegister(
    @Param('id') id: string,
    @Param('registerId') registerId: string,
  ) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const register = await this.financeRegisterTributeRepository.findById(
      Number(registerId),
    );

    if (!register) {
      throw new NotFoundException(MessageService.Finance_registerId_not_found);
    }

    await this.financeRegisterTributeRepository.delete(register.id);

    const totalAddition =
      await this.financeRegisterTributeRepository.sumFinanceAndType(
        finance.id,
        'ACRESCIMO',
      );
    const totalDiscount =
      await this.financeRegisterTributeRepository.sumFinanceAndType(
        finance.id,
        'DESCONTO',
      );

    const totalAdditionDiscount = totalAddition - totalDiscount;

    const totalLiquid = finance.documento_valor + totalAdditionDiscount;

    await this.financeRepository.update(finance.id, {
      total_acrescimo: totalAddition,
      total_desconto: totalDiscount,
      acrescimo_desconto: totalAdditionDiscount,
      total_liquido: totalLiquid,
    });

    return {
      deleted: true,
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Get('/finance/:id/installment')
  async findInstallmentByFinance(@Param('id') id: string) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const allInstallment = await this.financePaymentRepository.findByFinance(
      finance.id,
    );

    const allTributeAddition =
      await this.financeRegisterTributeRepository.sumFinanceAndType(
        finance.id,
        'ACRESCIMO',
      );

    const allTributeDiscount =
      await this.financeRegisterTributeRepository.sumFinanceAndType(
        finance.id,
        'DESCONTO',
      );

    return {
      data: {
        paymentType: finance.paymentType
          ? {
              value: finance.paymentType.id.toString(),
              label: finance.paymentType.descricao,
            }
          : {},
        split: Boolean(finance.parcelar),
        quantitySplit: finance.quantidade_parcela,
        dueDate: finance.data_vencimento,
        totalGross: finance.documento_valor,
        totalAddition: allTributeAddition,
        totalDiscount: allTributeDiscount * -1,
        totalLiquid: finance.total_liquido,
        fixedFrequency: Boolean(finance.frequencia_fixa),
        paymentFrequency: finance.frequencia_pagamento,
        installment: allInstallment.map((installment) => {
          return {
            id: installment.id,
            dueDate: installment.vencimento,
            split: installment.parcela,
            prorogation: installment.prorrogacao,
            status: installment.statusPay.descricao,
            addition: installment.acrescimo,
            discount: installment.desconto,
            valuePay: installment.valor_a_pagar,
            valueSplit: installment.valor_parcela,
            paymentDate:
              installment?.emissionItem?.emission.data_vencimento || null,
          };
        }),
      },
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Put('/finance/:id/installment')
  async updateInstallmentFinance(
    @Param('id') id: string,
    @Body() body: UpdateInstallmentFinanceBody,
  ) {
    let finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const totalItem = await this.financeItemRepository.aggregateByTitle(
      finance.id,
    );

    const allInstallment = await this.financePaymentRepository.findByFinance(
      finance.id,
    );

    if (allInstallment.some((split) => split.status === 3)) {
      throw new NotFoundException(MessageService.Finance_not_generate_split);
    }

    if (totalItem._sum.total === null || Number(totalItem._sum.total) === 0) {
      throw new NotFoundException(MessageService.FinanceItem_not_launch);
    }

    await this.financeRepository.update(finance.id, {
      documento_tipo: Number(body.paymentTypeId),
      parcelar: Number(body.split),
      quantidade_parcela: body?.quantitySplit || 1,
      data_vencimento: dayjs(body.dueDate).toDate(),
      documento_valor: Number(totalItem._sum.total),
      frequencia_fixa: Number(body?.fixedFrequency) || 0,
      frequencia_pagamento: body?.paymentFrequency || 0,
    });

    finance = await this.financeRepository.findById(Number(id));

    const totalLiquid = finance.total_liquido;

    const totalSplit = totalLiquid / finance.quantidade_parcela;

    await this.financePaymentRepository.deleteByFinance(finance.id);

    let dueDate = dayjs(finance.data_vencimento);

    for await (const split of Array.from(
      Array(finance.quantidade_parcela).keys(),
    )) {
      await this.financePaymentRepository.create({
        id_titulo: finance.id,
        parcela: split + 1,
        vencimento: dueDate.toDate(),
        valor_a_pagar: totalSplit,
        valor_parcela: totalSplit,
      });

      if (finance.frequencia_fixa) {
        dueDate = dueDate.add(1, 'month');
      } else {
        dueDate = dueDate.add(finance.frequencia_pagamento, 'day');
      }
    }

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Put('/finance/:id/installment/:paymentId')
  async updatePayment(
    @Param('paymentId') paymentId: string,
    @Body() body: UpdatePaymentBody,
  ) {
    const payment = await this.financePaymentRepository.findById(
      Number(paymentId),
    );

    if (!payment) {
      throw new NotFoundException(MessageService.Finance_paymentId_not_found);
    }

    if (payment.status === 3) {
      throw new NotFoundException(MessageService.Finance_not_generate_split);
    }

    await this.financePaymentRepository.update(payment.id, {
      valor_a_pagar: body.value,
      valor_parcela:
        (payment.acrescimo || 0 - payment.desconto || 0) + body.value,
      vencimento: dayjs(body.dueDate).toDate(),
    });

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Delete('/finance/:id/installment/:paymentId')
  async deletePayment(@Param('paymentId') paymentId: string) {
    const payment = await this.financePaymentRepository.findById(
      Number(paymentId),
    );

    if (!payment) {
      throw new NotFoundException(MessageService.Finance_paymentId_not_found);
    }

    if (payment.status === 3) {
      throw new NotFoundException(MessageService.Finance_not_generate_split);
    }

    await this.financePaymentRepository.delete(payment.id);

    return {
      deleted: true,
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Get('/finance/:id/finalize')
  async finalize(@Param('id') id: string) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    if (finance.status !== 'ABERTO') {
      throw new ForbiddenException(MessageService.Finance_not_open);
    }

    const totalLiquid = finance.total_liquido;

    if (totalLiquid === 0) {
      throw new ForbiddenException(MessageService.FinanceItem_not_launch);
    }

    const totalSplit = await this.financePaymentRepository.sumByFinance(
      finance.id,
    );

    if (totalSplit === 0) {
      throw new ForbiddenException(MessageService.Finance_payment_not_launch);
    }

    if (totalLiquid !== totalSplit) {
      throw new ForbiddenException(MessageService.Finance_total_not_equal);
    }

    await this.financeRepository.update(finance.id, {
      status: 'PROCESSANDO',
    });

    return {
      finalize: true,
    };
  }
}
