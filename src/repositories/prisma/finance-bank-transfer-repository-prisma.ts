import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_financeiro_banco_transferencia,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import IFinanceBankTransfer from 'src/models/IFinanceBankTransfer';
import FinanceBankTransferRepository from '../finance-bank-transfer-repository';

@Injectable()
export default class FinanceBankTransferRepositoryPrisma
  implements FinanceBankTransferRepository
{
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService.smartnewsystem_financeiro_banco_transferencia;

  async listByClient(
    clientId: number,
  ): Promise<IFinanceBankTransfer['listByClient'][]> {
    const bankTransfer = await this.table.findMany({
      select: {
        id: true,
        data_transferencia: true,
        valor: true,
        log_date: true,
        bankOrigin: {
          select: {
            id: true,
            nome: true,
          },
        },
        bankDestination: {
          select: {
            id: true,
            nome: true,
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        provider: {
          select: {
            ID: true,
            razao_social: true,
          },
        },
        composition: {
          select: {
            id: true,
            composicao: true,
            descricao: true,
          },
        },
        paymentType: {
          select: {
            id: true,
            descricao: true,
          },
        },
      },
      where: {
        id_cliente: clientId,
      },
    });

    return bankTransfer;
  }

  async findById(id: number): Promise<IFinanceBankTransfer['findById']> {
    const bankTransfer = await this.table.findUnique({
      select: {
        id: true,
        data_transferencia: true,
        valor: true,
        log_date: true,
        bankOrigin: {
          select: {
            id: true,
            nome: true,
          },
        },
        bankDestination: {
          select: {
            id: true,
            nome: true,
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        provider: {
          select: {
            ID: true,
            razao_social: true,
          },
        },
        composition: {
          select: {
            id: true,
            composicao: true,
            descricao: true,
          },
        },
        financePay: {
          select: {
            id: true,
            financeControl: {
              select: {
                id: true,
              },
            },
            installmentFinance: {
              select: {
                id: true,
                emissionItem: {
                  select: {
                    id: true,
                    emission: {
                      select: {
                        id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        financeReceive: {
          select: {
            id: true,
            financeControl: {
              select: {
                id: true,
              },
            },
            installmentFinance: {
              select: {
                id: true,
                emissionItem: {
                  select: {
                    id: true,
                    emission: {
                      select: {
                        id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });

    return bankTransfer;
  }

  async create(
    data: Prisma.smartnewsystem_financeiro_banco_transferenciaUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_banco_transferencia> {
    const bankTransfer = await this.table.create({
      data,
    });

    return bankTransfer;
  }

  async createTransaction(
    user: { clientId: number; login: string },
    dueDate: Date,
    dateFormat: Date,
    value: number,
    bankOriginId: number,
    bankDestinationId: number,
    branchId: number,
    providerId: number,
    compositionId: number,
    financeTypePaymentId: number,
    typeDocumentId: number,
    materialId: number,
    contractTypeInputId: number,
  ): Promise<{
    success: boolean;
    errorMessage: string | null;
    message: string | null;
  }> {
    try {
      await this.prismaService.$transaction(
        async (prisma) => {
          const transfer =
            await prisma.smartnewsystem_financeiro_banco_transferencia.create({
              data: {
                id_cliente: user.clientId,
                data_transferencia: dueDate,
                valor: value,
                id_banco_origem: bankOriginId,
                id_banco_destino: bankDestinationId,
                id_filial: branchId,
                id_fornecedor: providerId,
                id_composicao: compositionId,
                id_tipo_pagamento: financeTypePaymentId,
                log_user: user.login,
              },
            });

          const findLastNumber =
            await prisma.smartnewsystem_financeiro_numero.findFirst({
              orderBy: {
                numero: 'desc',
              },
              where: {
                id_cliente: user.clientId,
              },
            });

          let lastNumberProcess = 0;

          if (findLastNumber) {
            lastNumberProcess = findLastNumber.numero;
          }

          const findFiscalNumber =
            await prisma.smartnewsystem_financeiro_numero_tipo_documento.findFirst(
              {
                orderBy: {
                  numero: 'desc',
                },
                where: {
                  id_cliente: user.clientId,
                  id_tipo_documento: typeDocumentId,
                },
              },
            );

          let fiscalNumber = 0;

          if (findFiscalNumber) {
            fiscalNumber = findFiscalNumber.numero;
          }

          let type: 'receber' | 'pagar' = 'pagar';

          await prisma.smartnewsystem_financeiro_controle.create({
            data: {
              emitente_pagar: type === 'pagar' ? providerId : null,
              remetente_pagar: type === 'pagar' ? branchId : null,
              emitente_receber: type !== 'pagar' ? branchId : null,
              remetente_receber: type !== 'pagar' ? providerId : null,
              finance: {
                create: {
                  direcao: type,
                  id_cliente: user.clientId,
                  documento_numero: (lastNumberProcess + 1).toString(),
                  id_documento_tipo: typeDocumentId,
                  data_emissao: dateFormat,
                  data_lancamento: dateFormat,
                  emitente: providerId,
                  remetente: branchId,
                  id_filial: type === 'pagar' ? branchId : providerId,
                  id_filial_pagador: 0,
                  id_fornecedor: 0,
                  chave: null,
                  descricao: null,
                  log_user: user.login,
                  numero_fiscal: (fiscalNumber + 1).toString(),
                  total_acrescimo: 0,
                  total_desconto: 0,
                  documento_tipo: financeTypePaymentId,
                  quantidade_parcela: 1,
                  parcelar: 0,
                  total_liquido: value,
                  documento_valor: value,
                  data_vencimento: dueDate,
                  status: 'FECHADO',
                  numberFinance: {
                    create: {
                      id_cliente: user.clientId,
                      numero: lastNumberProcess + 1,
                    },
                  },
                },
              },
            },
          });

          const financePay =
            await prisma.smartnewsystem_financeiro_descricao_titulos.findFirst({
              orderBy: {
                id: 'desc',
              },
              where: {
                id_cliente: user.clientId,
                direcao: type,
              },
            });

          await prisma.smartnewsystem_financeiro_numero_tipo_documento.create({
            data: {
              id_cliente: user.clientId,
              id_tipo_documento: typeDocumentId,
              numero: fiscalNumber + 1,
            },
          });

          await prisma.smartnewsystem_financeiro_titulos_dados.create({
            data: {
              id_titulo: financePay.id,
              id_material: materialId,
              id_item_centro_custo: compositionId,
              log_user: user.login,
              preco_unitario: value,
              quantidade: 1,
              total: value,
            },
          });

          let financePaymentSplit =
            await prisma.smartnewsystem_financeiro_titulo_pagamento.create({
              data: {
                id_titulo: financePay.id,
                parcela: 1,
                valor_parcela: value,
                valor_a_pagar: value,
                vencimento: dueDate,
                prorrogacao: dueDate,
                status: 3,
              },
            });

          const emissionPay =
            await prisma.smartnewsystem_financeiro_emissao.create({
              data: {
                id_cliente: user.clientId,
                id_banco: bankOriginId,
                data_vencimento: dueDate,
                log_user: user.login,
                pago: 1,
              },
            });

          await prisma.smartnewsystem_financeiro_emissao_itens.create({
            data: {
              id_emissao: emissionPay.id,
              id_pagamento: financePaymentSplit.id,
            },
          });

          await prisma.smartnewsystem_financeiro_banco_movimentacao.create({
            data: {
              id_banco: bankOriginId,
              valor: value,
              data_lancamento: dueDate,
              id_emissao: emissionPay.id,
              tipo: 'SAIDA',
            },
          });

          type = 'receber';

          const newFindLastNumber =
            await prisma.smartnewsystem_financeiro_numero.findFirst({
              orderBy: {
                numero: 'desc',
              },
              where: {
                id_cliente: user.clientId,
              },
            });

          if (newFindLastNumber) {
            lastNumberProcess = newFindLastNumber.numero;
          }

          const newFindFiscalNumber =
            await prisma.smartnewsystem_financeiro_numero_tipo_documento.findFirst(
              {
                orderBy: {
                  numero: 'desc',
                },
                where: {
                  id_cliente: user.clientId,
                  id_tipo_documento: typeDocumentId,
                },
              },
            );

          if (newFindFiscalNumber) {
            fiscalNumber = newFindFiscalNumber.numero;
          }

          await prisma.smartnewsystem_financeiro_controle.create({
            data: {
              emitente_pagar: type !== 'receber' ? providerId : null,
              remetente_pagar: type !== 'receber' ? branchId : null,
              emitente_receber: type === 'receber' ? branchId : null,
              remetente_receber: type === 'receber' ? providerId : null,
              finance: {
                create: {
                  direcao: type,
                  id_cliente: user.clientId,
                  documento_numero: (lastNumberProcess + 1).toString(),
                  id_documento_tipo: typeDocumentId,
                  data_emissao: dateFormat,
                  data_lancamento: dateFormat,
                  emitente: branchId,
                  remetente: providerId,
                  id_filial: type === 'receber' ? branchId : providerId,
                  id_filial_pagador: 0,
                  id_fornecedor: 0,
                  chave: null,
                  descricao: null,
                  log_user: user.login,
                  numero_fiscal: (fiscalNumber + 1).toString(),
                  total_acrescimo: 0,
                  total_desconto: 0,
                  documento_tipo: financeTypePaymentId,
                  quantidade_parcela: 1,
                  parcelar: 0,
                  total_liquido: value,
                  documento_valor: value,
                  data_vencimento: dueDate,
                  status: 'FECHADO',
                  numberFinance: {
                    create: {
                      id_cliente: user.clientId,
                      numero: lastNumberProcess + 1,
                    },
                  },
                },
              },
            },
          });

          const financeReceive =
            await prisma.smartnewsystem_financeiro_descricao_titulos.findFirst({
              orderBy: {
                id: 'desc',
              },
              where: {
                direcao: type,
                id_cliente: user.clientId,
              },
            });

          await prisma.smartnewsystem_financeiro_numero_tipo_documento.create({
            data: {
              id_cliente: user.clientId,
              id_tipo_documento: typeDocumentId,
              numero: fiscalNumber + 1,
            },
          });

          await prisma.smartnewsystem_financeiro_titulos_dados.create({
            data: {
              id_titulo: financeReceive.id,
              //id_material: material.id,
              id_insumo: contractTypeInputId,
              id_item_centro_custo: compositionId,
              log_user: user.login,
              preco_unitario: value,
              quantidade: 1,
              total: value,
            },
          });

          financePaymentSplit =
            await prisma.smartnewsystem_financeiro_titulo_pagamento.create({
              data: {
                id_titulo: financeReceive.id,
                parcela: 1,
                valor_parcela: value,
                valor_a_pagar: value,
                vencimento: dueDate,
                prorrogacao: dueDate,
                status: 3,
              },
            });

          const emissionReceive =
            await prisma.smartnewsystem_financeiro_emissao.create({
              data: {
                id_cliente: user.clientId,
                id_banco: bankDestinationId,
                data_vencimento: dueDate,
                log_user: user.login,
                pago: 1,
              },
            });

          await prisma.smartnewsystem_financeiro_emissao_itens.create({
            data: {
              id_emissao: emissionReceive.id,
              id_pagamento: financePaymentSplit.id,
            },
          });

          await prisma.smartnewsystem_financeiro_banco_movimentacao.create({
            data: {
              id_banco: bankDestinationId,
              valor: value,
              data_lancamento: dueDate,
              id_emissao: emissionReceive.id,
              tipo: 'ENTRADA',
            },
          });

          await prisma.smartnewsystem_financeiro_banco_transferencia.update({
            data: {
              id_financeiro_pagar: financePay.id,
              id_financeiro_receber: financeReceive.id,
            },
            where: {
              id: transfer.id,
            },
          });
        },
        {
          timeout: 180000, // 3 min
        },
      );
    } catch (error) {
      console.log('Error creating transaction:', error);
      return {
        success: false,
        errorMessage: error.message,
        message: 'Error ao criar transferência',
      };
    }

    return {
      success: true,
      errorMessage: null,
      message: 'Transferência criada com sucesso',
    };
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_financeiro_banco_transferenciaUncheckedUpdateInput,
  ): Promise<smartnewsystem_financeiro_banco_transferencia> {
    const bankTransfer = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return bankTransfer;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id,
      },
    });

    return true;
  }

  async deleteTransaction(id: number): Promise<{
    success: boolean;
    errorMessage: string | null;
    message: string;
  }> {
    try {
      await this.prismaService.$transaction(
        async (prisma) => {
          const table = prisma.smartnewsystem_financeiro_banco_transferencia;

          const transfer = await table.findFirst({
            select: {
              id: true,
              data_transferencia: true,
              valor: true,
              log_date: true,
              bankOrigin: {
                select: {
                  id: true,
                  nome: true,
                },
              },
              bankDestination: {
                select: {
                  id: true,
                  nome: true,
                },
              },
              branch: {
                select: {
                  ID: true,
                  filial_numero: true,
                },
              },
              provider: {
                select: {
                  ID: true,
                  razao_social: true,
                },
              },
              composition: {
                select: {
                  id: true,
                  composicao: true,
                  descricao: true,
                },
              },
              financePay: {
                select: {
                  id: true,
                  financeControl: {
                    select: {
                      id: true,
                    },
                  },
                  installmentFinance: {
                    select: {
                      id: true,
                      emissionItem: {
                        select: {
                          id: true,
                          emission: {
                            select: {
                              id: true,
                              financeBankMove: {
                                select: {
                                  id: true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              financeReceive: {
                select: {
                  id: true,
                  financeControl: {
                    select: {
                      id: true,
                    },
                  },
                  installmentFinance: {
                    select: {
                      id: true,
                      emissionItem: {
                        select: {
                          id: true,
                          emission: {
                            select: {
                              id: true,
                              financeBankMove: {
                                select: {
                                  id: true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            where: {
              id,
            },
          });

          if (!transfer) {
            throw 'Transferência não encontrada';
          }

          await table.delete({
            where: {
              id: transfer.id,
            },
          });

          if (transfer.financePay) {
            for await (const payment of transfer.financePay
              .installmentFinance) {
              await prisma.smartnewsystem_financeiro_emissao_itens.delete({
                where: {
                  id: payment.emissionItem.id,
                },
              });

              await prisma.smartnewsystem_financeiro_emissao.delete({
                where: {
                  id: payment.emissionItem.emission.id,
                },
              });

              // if (payment.emissionItem.emission.financeBankMove.length) {
              //
              //   await prisma.smartnewsystem_financeiro_banco_movimentacao.delete(
              //     {
              //       where: {
              //         id: payment.emissionItem.emission.financeBankMove[0].id,
              //       },
              //     },
              //   );
              // }

              await prisma.smartnewsystem_financeiro_titulo_pagamento.delete({
                where: {
                  id: payment.id,
                },
              });
            }

            await prisma.smartnewsystem_financeiro_descricao_titulos.delete({
              where: {
                id: transfer.financePay.id,
              },
            });

            if (transfer.financePay.financeControl) {
              await prisma.smartnewsystem_financeiro_controle.delete({
                where: {
                  id: transfer.financePay.financeControl.id,
                },
              });
            }
          }

          if (transfer.financeReceive) {
            for await (const payment of transfer.financeReceive
              .installmentFinance) {
              await prisma.smartnewsystem_financeiro_emissao_itens.delete({
                where: {
                  id: payment.emissionItem.id,
                },
              });

              await prisma.smartnewsystem_financeiro_emissao.delete({
                where: {
                  id: payment.emissionItem.emission.id,
                },
              });

              // if (payment.emissionItem.emission.financeBankMove.length) {
              //
              //   await prisma.smartnewsystem_financeiro_banco_movimentacao.delete(
              //     {
              //       where: {
              //         id: payment.emissionItem.emission.financeBankMove[0].id,
              //       },
              //     },
              //   );
              // }

              await prisma.smartnewsystem_financeiro_titulo_pagamento.delete({
                where: {
                  id: payment.id,
                },
              });
            }

            await prisma.smartnewsystem_financeiro_descricao_titulos.delete({
              where: {
                id: transfer.financeReceive.id,
              },
            });

            if (transfer.financeReceive.financeControl) {
              await prisma.smartnewsystem_financeiro_controle.delete({
                where: {
                  id: transfer.financeReceive.financeControl.id,
                },
              });
            }
          }
        },
        {
          timeout: 180000,
        },
      );
    } catch (error) {
      console.log(error);
      return {
        success: false,
        errorMessage: error.message,
        message: 'Error ao deletar transação',
      };
    }

    return {
      success: true,
      errorMessage: null,
      message: 'Transferência excluída com sucesso',
    };
  }
}
