import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IFinancePrisma } from 'src/models/IFinance';
import { IUserInfo } from 'src/models/IUser';
import InsertedResponseSwagger from 'src/models/swagger/inserted-response';
import { BranchRepository } from 'src/repositories/branch-repository';
import { CompositionItemRepository } from 'src/repositories/composition-item-repository';
import ContractTypeInputRepository from 'src/repositories/contract-type-input-repository';
import FinanceBankRepository from 'src/repositories/finance-bank-repository';
import FinanceBankTransferRepository from 'src/repositories/finance-bank-transfer-repository';
import FinanceControlRepository from 'src/repositories/finance-control-repository';
import FinanceEmissionRepository from 'src/repositories/finance-emission-repository';
import FinanceEmissionItemRepository from 'src/repositories/finance-emissionItem-repository';
import { FinanceItemRepository } from 'src/repositories/finance-item-repository';
import FinanceNumberRepository from 'src/repositories/finance-number-repository';
import FinanceNumberTypeDocumentRepository from 'src/repositories/finance-numberTypeDocument-repository';
import { FinancePaymentRepository } from 'src/repositories/finance-payment-repository';
import FinanceRepository from 'src/repositories/finance-repository';
import FinanceTypeDocumentRepository from 'src/repositories/finance-typeDocument-repository';
import FinanceTypePaymentRepository from 'src/repositories/finance-typePayment-repository';
import LogFinanceRepository from 'src/repositories/log-finance-repository';
import MaterialRepository from 'src/repositories/material-repository';
import ProviderRepository from 'src/repositories/provider-repository';
import { DateService } from 'src/service/data.service';
import { MessageService } from 'src/service/message.service';
import InsertTransactionBody from './dtos/insertTransaction-body';

@ApiTags('Script Case - Financial - Bank - Transaction')
//@ApiTags('Script Case - Financeiro - Bancos - Transferências')
@ApiBearerAuth()
@Controller('script-case/financial/bank/transaction')
export default class TransactionScriptCaseController {
  constructor(
    private dateService: DateService,
    private financeBankTransferRepository: FinanceBankTransferRepository,
    private financeBankRepository: FinanceBankRepository,
    private branchRepository: BranchRepository,
    private providerRepository: ProviderRepository,
    private compositionItemRepository: CompositionItemRepository,
    private financeTypePaymentRepository: FinanceTypePaymentRepository,
    private financeNumberRepository: FinanceNumberRepository,
    private financeTypeDocumentRepository: FinanceTypeDocumentRepository,
    private financeNumberTypeDocumentRepository: FinanceNumberTypeDocumentRepository,
    private financeControlRepository: FinanceControlRepository,
    private materialRepository: MaterialRepository,
    private financeRepository: FinanceRepository,
    private financeItemRepository: FinanceItemRepository,
    private financePaymentRepository: FinancePaymentRepository,
    private financeEmissionRepository: FinanceEmissionRepository,
    private financeEmissionItemRepository: FinanceEmissionItemRepository,
    private logFinanceRepository: LogFinanceRepository,
    private contractTypeInputRepository: ContractTypeInputRepository,
  ) {}

  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Get('/')
  async listTransactions(@Req() req) {
    const user: IUserInfo = req.user;

    const allTransfer = await this.financeBankTransferRepository.listByClient(
      user.clientId,
    );
    // ORIGEM
    // DESTINO
    // FORNECEDOR
    // FILIAL
    // CENTRO DE CUSTO
    // TIPO DE PAGAMENTO
    // VALOR
    // DATA DA TRANSAÇÃO
    const response = allTransfer.map((transfer) => {
      return {
        id: transfer.id,
        bankOrigin: {
          value: transfer.bankOrigin.id.toString(),
          label: transfer.bankOrigin.nome,
        },
        bankDestination: {
          value: transfer.bankDestination.id.toString(),
          label: transfer.bankDestination.nome,
        },
        provider: {
          value: transfer.provider.ID.toString(),
          label: transfer.provider.razao_social,
        },
        branch: {
          value: transfer.branch.ID.toString(),
          label: transfer.branch.filial_numero,
        },
        composition: {
          value: transfer.composition.id.toString(),
          label: `${transfer.composition.composicao} - ${transfer.composition.descricao}`,
        },
        typePayment: {
          value: transfer.paymentType.id,
          label: transfer.paymentType.descricao,
        },
        value: transfer.valor,
        date: transfer.data_transferencia,
      };
    });

    return {
      data: response,
    };
  }

  async logFinance(
    finance: IFinancePrisma,
    user: IUserInfo,
    action: 'INSERT' | 'UPDATE' | 'DELETE',
  ): Promise<boolean> {
    await this.logFinanceRepository.insert({
      //id: finance.id,
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

  @ApiOkResponse({ description: 'Success', type: InsertedResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Post('/')
  async insertTransaction(@Req() req, @Body() body: InsertTransactionBody) {
    const user: IUserInfo = req.user;

    const bankOrigin = await this.financeBankRepository.findById(
      Number(body.bankOriginId),
    );

    if (!bankOrigin) {
      throw new NotFoundException(
        MessageService.Finance_BankTransfer_origin_not_found,
      );
    }

    const bankDestination = await this.financeBankRepository.findById(
      Number(body.bankDestinationId),
    );

    if (!bankDestination) {
      throw new NotFoundException(
        MessageService.Finance_BankTransfer_destiny_not_found,
      );
    }

    const branch = await this.branchRepository.findById(Number(body.branchId));

    if (!branch) {
      throw new NotFoundException(MessageService.Branch_not_found);
    }

    const provider = await this.providerRepository.findById(
      Number(body.providerId),
    );

    if (!provider) {
      throw new NotFoundException(MessageService.Provider_id_not_found);
    }

    const composition = await this.compositionItemRepository.findById(
      Number(body.compositionId),
    );

    if (!composition) {
      throw new NotFoundException(
        MessageService.FinanceItem_cost_center_not_found,
      );
    }

    const financeTypePayment = await this.financeTypePaymentRepository.findById(
      Number(body.typePaymentId),
    );

    if (!financeTypePayment) {
      throw new NotFoundException(MessageService.Finance_typePayment_not_found);
    }

    let typeDocument =
      await this.financeTypeDocumentRepository.findByClientAndName(
        user.clientId,
        'Transferência',
      );

    if (!typeDocument) {
      typeDocument = await this.financeTypeDocumentRepository.create({
        id_cliente: user.clientId,
        descricao: 'Transferência',
        requer_chave: false,
        numeracao_automatica: true,
      });
    }

    const material = await this.materialRepository.findByClientAndMaterial(
      user.clientId,
      'Transferência',
    );
    let materialID: number;
    if (!material) {
      const obj = await this.materialRepository.create({
        id_cliente: user.clientId,
        id_filial: branch.ID,
        codigo: 'TF-01',
        material: 'Transferência',
        unidade: 'UN',
        valor: 0,
        Valor_venda: 0,
        fator: 0,
        log_user: user.login,
        ativo: 1,
        tipo: 'service',
      });
      materialID = obj.id;
    } else {
      materialID = material.id;
    }

    let contractTypeInput =
      await this.contractTypeInputRepository.findByClientAndName(
        user.clientId,
        'Transferência',
      );

    if (!contractTypeInput) {
      contractTypeInput = await this.contractTypeInputRepository.create({
        id_cliente: user.clientId,
        insumo: 'Transferência',
      });
    }

    const dueDate = this.dateService.dayjsAddTree(body.date).toDate();

    const insertTransaction =
      await this.financeBankTransferRepository.createTransaction(
        user,
        dueDate,
        this.dateService.dayjsAddTree(dueDate).toDate(),
        body.value,
        bankOrigin.id,
        bankDestination.id,
        branch.ID,
        provider.ID,
        composition.id,
        financeTypePayment.id,
        typeDocument.id,
        materialID,
        contractTypeInput.id,
      );

    if (!insertTransaction.success) {
      throw new ConflictException({
        inserted: false,
        errorMessage: insertTransaction.errorMessage,
        message: insertTransaction.message,
      });
    }

    //const bankTransfer = await this.financeBankTransferRepository.create({
    //   id_cliente: user.clientId,
    //   data_transferencia: dueDate,
    //   valor: body.value,
    //   id_banco_origem: bankOrigin.id,
    //   id_banco_destino: bankDestination.id,
    //   id_filial: branch.ID,
    //   id_fornecedor: provider.ID,
    //   id_composicao: composition.id,
    //   id_tipo_pagamento: financeTypePayment.id,
    //   log_user: user.login,
    // });

    // let lastNumberProcess = await this.financeNumberRepository.findLastNumber(
    //   user.clientId,
    // );

    // let typeDocument =
    //   await this.financeTypeDocumentRepository.findByClientAndName(
    //     user.clientId,
    //     'Transferência',
    //   );

    // if (!typeDocument) {
    //   typeDocument = await this.financeTypeDocumentRepository.create({
    //     id_cliente: user.clientId,
    //     descricao: 'Transferência',
    //     requer_chave: false,
    //     numeracao_automatica: true,
    //   });
    // }

    // let fiscalNumber =
    //   await this.financeNumberTypeDocumentRepository.lastNumber(
    //     user.clientId,
    //     typeDocument.id,
    //   );

    // let material = await this.materialRepository.findByClientAndMaterial(
    //   user.clientId,
    //   'Transferência',
    // );

    // if (!material) {
    //   material = await this.materialRepository.create({
    //     id_cliente: user.clientId,
    //     id_filial: branch.ID,
    //     codigo: 'TF-01',
    //     material: 'Transferência',
    //     unidade: 'UN',
    //     valor: 0,
    //     Valor_venda: 0,
    //     fator: 0,
    //     log_user: user.login,
    //     ativo: 1,
    //     tipo: 'service',
    //   });
    // }

    // let contractTypeInput =
    //   await this.contractTypeInputRepository.findByClientAndName(
    //     user.clientId,
    //     'Transferência',
    //   );

    // if (!contractTypeInput) {
    //   contractTypeInput = await this.contractTypeInputRepository.create({
    //     id_cliente: user.clientId,
    //     insumo: 'Transferência',
    //   });
    // }

    // //pagar
    // let type: 'pagar' | 'receber' = 'pagar';

    // await this.financeControlRepository.insert({
    //   emitente_pagar: type === 'pagar' ? provider.ID : null,
    //   remetente_pagar: type === 'pagar' ? branch.ID : null,
    //   emitente_receber: type !== 'pagar' ? branch.ID : null,
    //   remetente_receber: type !== 'pagar' ? provider.ID : null,
    //   finance: {
    //     create: {
    //       direcao: type,
    //       id_cliente: user.clientId,
    //       documento_numero: (lastNumberProcess + 1).toString(),
    //       id_documento_tipo: typeDocument.id,
    //       data_emissao: this.dateService
    //         .dayjs(new Date())
    //         .subtract(3, 'h')
    //         .toDate(),
    //       data_lancamento: this.dateService
    //         .dayjs(new Date())
    //         .subtract(3, 'h')
    //         .toDate(),
    //       emitente: provider.ID,
    //       remetente: branch.ID,
    //       id_filial: type === 'pagar' ? branch.ID : provider.ID,
    //       id_filial_pagador: 0,
    //       id_fornecedor: 0,
    //       chave: null,
    //       descricao: null,
    //       log_user: user.login,
    //       numero_fiscal: (fiscalNumber + 1).toString(),
    //       total_acrescimo: 0,
    //       total_desconto: 0,
    //       documento_tipo: financeTypePayment.id,
    //       quantidade_parcela: 1,
    //       parcelar: 0,
    //       total_liquido: body.value,
    //       documento_valor: body.value,
    //       data_vencimento: dueDate,
    //       numberFinance: {
    //         create: {
    //           id_cliente: user.clientId,
    //           numero: lastNumberProcess + 1,
    //         },
    //       },
    //     },
    //   },
    // });

    // const financePay = await this.financeRepository.findLast(user.clientId);

    // await this.financeNumberTypeDocumentRepository.insert({
    //   id_cliente: user.clientId,
    //   id_tipo_documento: typeDocument.id,
    //   numero: fiscalNumber + 1,
    // });

    // await this.logFinance(financePay, user, 'INSERT');

    // await this.financeItemRepository.insert({
    //   id_titulo: financePay.id,
    //   id_material: material.id,
    //   id_item_centro_custo: composition.id,
    //   log_user: user.login,
    //   preco_unitario: body.value,
    //   quantidade: 1,
    //   total: body.value,
    // });

    // let financePaymentSplit = await this.financePaymentRepository.create({
    //   id_titulo: financePay.id,
    //   parcela: 1,
    //   valor_parcela: body.value,
    //   valor_a_pagar: body.value,
    //   vencimento: dueDate,
    //   prorrogacao: dueDate,
    //   status: 3,
    // });

    // const emissionPay = await this.financeEmissionRepository.create({
    //   id_cliente: user.clientId,
    //   id_banco: bankOrigin.id,
    //   data_vencimento: dueDate,
    //   log_user: user.login,
    //   pago: 1,
    // });

    // await this.financeEmissionItemRepository.create({
    //   id_emissao: emissionPay.id,
    //   id_pagamento: financePaymentSplit.id,
    // });

    // type = 'receber';

    // lastNumberProcess = await this.financeNumberRepository.findLastNumber(
    //   user.clientId,
    // );

    // fiscalNumber = await this.financeNumberTypeDocumentRepository.lastNumber(
    //   user.clientId,
    //   typeDocument.id,
    // );

    // await this.financeControlRepository.insert({
    //   emitente_pagar: type !== 'receber' ? provider.ID : null,
    //   remetente_pagar: type !== 'receber' ? branch.ID : null,
    //   emitente_receber: type === 'receber' ? branch.ID : null,
    //   remetente_receber: type === 'receber' ? provider.ID : null,
    //   finance: {
    //     create: {
    //       direcao: type,
    //       id_cliente: user.clientId,
    //       documento_numero: (lastNumberProcess + 1).toString(),
    //       id_documento_tipo: typeDocument.id,
    //       data_emissao: this.dateService
    //         .dayjs(new Date())
    //         .subtract(3, 'h')
    //         .toDate(),
    //       data_lancamento: this.dateService
    //         .dayjs(new Date())
    //         .subtract(3, 'h')
    //         .toDate(),
    //       emitente: branch.ID,
    //       remetente: provider.ID,
    //       id_filial: type === 'receber' ? branch.ID : provider.ID,
    //       id_filial_pagador: 0,
    //       id_fornecedor: 0,
    //       chave: null,
    //       descricao: null,
    //       log_user: user.login,
    //       numero_fiscal: (fiscalNumber + 1).toString(),
    //       total_acrescimo: 0,
    //       total_desconto: 0,
    //       documento_tipo: financeTypePayment.id,
    //       quantidade_parcela: 1,
    //       parcelar: 0,
    //       total_liquido: body.value,
    //       documento_valor: body.value,
    //       data_vencimento: dueDate,
    //       numberFinance: {
    //         create: {
    //           id_cliente: user.clientId,
    //           numero: lastNumberProcess + 1,
    //         },
    //       },
    //     },
    //   },
    // });

    // const financeReceive = await this.financeRepository.findLast(user.clientId);

    // await this.financeNumberTypeDocumentRepository.insert({
    //   id_cliente: user.clientId,
    //   id_tipo_documento: typeDocument.id,
    //   numero: fiscalNumber + 1,
    // });

    // await this.financeItemRepository.insert({
    //   id_titulo: financeReceive.id,
    //   //id_material: material.id,
    //   id_insumo: contractTypeInput.id,
    //   id_item_centro_custo: composition.id,
    //   log_user: user.login,
    //   preco_unitario: body.value,
    //   quantidade: 1,
    //   total: body.value,
    // });

    // financePaymentSplit = await this.financePaymentRepository.create({
    //   id_titulo: financeReceive.id,
    //   parcela: 1,
    //   valor_parcela: body.value,
    //   valor_a_pagar: body.value,
    //   vencimento: dueDate,
    //   prorrogacao: dueDate,
    //   status: 3,
    // });

    // const emissionReceive = await this.financeEmissionRepository.create({
    //   id_cliente: user.clientId,
    //   id_banco: bankDestination.id,
    //   data_vencimento: dueDate,
    //   log_user: user.login,
    //   pago: 1,
    // });

    // await this.financeEmissionItemRepository.create({
    //   id_emissao: emissionReceive.id,
    //   id_pagamento: financePaymentSplit.id,
    // });

    // await this.financeBankTransferRepository.update(bankTransfer.id, {
    //   id_financeiro_pagar: financePay.id,
    //   id_financeiro_receber: financeReceive.id,
    // });

    // await this.logFinance(finance, user, 'INSERT');

    return {
      inserted: true,
    };
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteTransaction(@Req() req, @Param('id') id: string) {
    const transfer = await this.financeBankTransferRepository.findById(
      Number(id),
    );

    if (!transfer) {
      throw new NotFoundException(
        MessageService.Finance_BankTransfer_id_not_found,
      );
    }

    const deleteBoundTransfer =
      await this.financeBankTransferRepository.deleteTransaction(transfer.id);

    if (!deleteBoundTransfer.success) {
      throw new ConflictException(deleteBoundTransfer);
    }

    // //pagar
    // if (transfer.financePay) {
    //   for await (const payment of transfer.financePay.installmentFinance) {
    //     await this.financeEmissionItemRepository.delete(
    //       payment.emissionItem.id,
    //     );

    //     await this.financeEmissionRepository.delete(
    //       payment.emissionItem.emission.id,
    //     );

    //     await this.financePaymentRepository.delete(payment.id);
    //   }

    //   await this.financeRepository.delete(transfer.financePay.id);

    //   if (transfer.financePay.financeControl) {
    //     await this.financeControlRepository.delete(
    //       transfer.financePay.financeControl.id,
    //     );
    //   }
    // }

    // //receber
    // if (transfer.financeReceive) {
    //   for await (const payment of transfer.financeReceive.installmentFinance) {
    //     await this.financeEmissionItemRepository.delete(
    //       payment.emissionItem.id,
    //     );

    //     await this.financeEmissionRepository.delete(
    //       payment.emissionItem.emission.id,
    //     );

    //     await this.financePaymentRepository.delete(payment.id);
    //   }

    //   await this.financeRepository.delete(transfer.financeReceive.id);

    //   if (transfer.financeReceive.financeControl) {
    //     await this.financeControlRepository.delete(
    //       transfer.financeReceive.financeControl.id,
    //     );
    //   }
    // }
    return {
      deleted: true,
    };
  }
}
