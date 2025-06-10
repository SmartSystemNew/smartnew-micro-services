import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import IFinancePaymentView from 'src/models/IFinancePaymentView';
import { FinancePaymentViewRepository } from '../finance-payment-view-repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class FinancePaymentViewRepositoryPrisma
  implements FinancePaymentViewRepository
{
  constructor(private prismaService: PrismaService) {}

  private tablePay = this.prismaService.smartnewsystem_view_financeiro_pagar;
  private tableReceive =
    this.prismaService.smartnewsystem_view_financeiro_receber;

  async infoTable(
    // clientId: string,
    take: number,
    skip: number,
    type: string,
    // dateEmission: string,
    // dueDate: string,
    // expectDate: string,
    // fiscalNumber: string,
    // forEmission: string,
    // issue: string,
    // prorogation: string,
    // sender: string,
    // status: string,
    // totalItem: string,
    // typePayment: string,
    // valuePay: string,
    // valueToPay: string,
    wherePay?: Prisma.smartnewsystem_view_financeiro_pagarWhereInput | null,
    whereReceive?: Prisma.smartnewsystem_view_financeiro_receberWhereInput | null,
  ): Promise<IFinancePaymentView['infoTable'][]> {
    const select = {
      id: true,
      id_cliente: true,
      id_titulo: true,
      documento_numero: true,
      numero_fiscal: true,
      data_emissao: true,
      emitente: true,
      remetente: true,
      vencimento: true,
      prorrogacao: true,
      valor_a_pagar: true,
      valor_parcela: true,
      parcela: true,
      status: true,
      descricao: true,
      totalItem: true,
      id_pedido: true,
      numero: true,
      data_vencimento: true,
      tipo_pagamento_id: true,
      tipo_pagamento: true,
      banco_id: true,
      banco_nome: true,
      finance: {
        select: {
          id: true,
          numero_fiscal: true,
          documento_numero: true,
          data_emissao: true,
          emitente: true,
          remetente: true,
          total_liquido: true,
          quantidade_parcela: true,
          registerTribute: {
            select: {
              id: true,
              tipo: true,
              valor: true,
              tribute: {
                select: {
                  id: true,
                  descricao: true,
                },
              },
            },
          },
          items: {
            select: {
              quantidade: true,
              preco_unitario: true,
              id_insumo: true,
              vinculo: true,
              compositionItem: {
                select: {
                  id: true,
                  composicao: true,
                  descricao: true,
                  compositionGroup: {
                    select: {
                      id: true,
                      composicao: true,
                      descricao: true,
                      costCenter: {
                        select: {
                          ID: true,
                          centro_custo: true,
                          descricao: true,
                        },
                      },
                    },
                  },
                },
              },
              material: {
                select: {
                  id: true,
                  material: true,
                },
              },
              input: {
                select: {
                  id: true,
                  insumo: true,
                },
              },
            },
          },
          installmentFinance: {
            select: {
              id: true,
            },
          },
        },
      },
    };
    if (type === 'pagar') {
      const account = await this.tablePay.findMany({
        distinct: 'id',
        take,
        skip,
        select,
        orderBy: {
          id: 'desc',
        },
        where: wherePay,
      });
      return account;
    } else {
      const account = await this.tableReceive.findMany({
        distinct: 'id',
        take,
        skip,
        select,
        orderBy: {
          id: 'desc',
        },
        where: whereReceive,
      });
      return account;
    }
  }

  async infoTableNoPage(
    type: 'pagar' | 'receber',
    wherePay?: Prisma.smartnewsystem_view_financeiro_pagarWhereInput | null,
    whereReceive?: Prisma.smartnewsystem_view_financeiro_receberWhereInput | null,
  ): Promise<IFinancePaymentView['infoTableNoPage'][]> {
    if (type === 'pagar') {
      const account = await this.tablePay.findMany({
        distinct: 'id',
        orderBy: {
          id: 'desc',
        },
        select: {
          id: true,
          id_cliente: true,
          id_titulo: true,
          documento_numero: true,
          numero_fiscal: true,
          data_emissao: true,
          emitente: true,
          remetente: true,
          vencimento: true,
          prorrogacao: true,
          valor_a_pagar: true,
          valor_parcela: true,
          parcela: true,
          status: true,
          descricao: true,
          totalItem: true,
          id_pedido: true,
          numero: true,
          data_vencimento: true,
          tipo_pagamento_id: true,
          tipo_pagamento: true,
          banco_id: true,
          banco_nome: true,
          finance: {
            select: {
              id: true,
              numero_fiscal: true,
              documento_numero: true,
              data_emissao: true,
              emitente: true,
              remetente: true,
              total_liquido: true,
              quantidade_parcela: true,
              registerTribute: {
                select: {
                  id: true,
                  tipo: true,
                  valor: true,
                  tribute: {
                    select: {
                      id: true,
                      descricao: true,
                    },
                  },
                },
              },
              items: {
                select: {
                  quantidade: true,
                  preco_unitario: true,
                  id_insumo: true,
                  vinculo: true,
                  compositionItem: {
                    select: {
                      id: true,
                      composicao: true,
                      descricao: true,
                      compositionGroup: {
                        select: {
                          id: true,
                          composicao: true,
                          descricao: true,
                          costCenter: {
                            select: {
                              ID: true,
                              centro_custo: true,
                              descricao: true,
                            },
                          },
                        },
                      },
                    },
                  },
                  material: {
                    select: {
                      id: true,
                      material: true,
                    },
                  },
                  input: {
                    select: {
                      id: true,
                      insumo: true,
                    },
                  },
                },
              },
            },
          },
        },
        where: wherePay,
      });
      return account;
    } else {
      const account = await this.tableReceive.findMany({
        distinct: 'id',
        orderBy: {
          id: 'desc',
        },
        select: {
          id: true,
          id_cliente: true,
          id_titulo: true,
          documento_numero: true,
          numero_fiscal: true,
          data_emissao: true,
          emitente: true,
          remetente: true,
          vencimento: true,
          prorrogacao: true,
          valor_a_pagar: true,
          valor_parcela: true,
          parcela: true,
          status: true,
          descricao: true,
          totalItem: true,
          id_pedido: true,
          numero: true,
          data_vencimento: true,
          tipo_pagamento_id: true,
          tipo_pagamento: true,
          banco_id: true,
          banco_nome: true,
          finance: {
            select: {
              id: true,
              numero_fiscal: true,
              documento_numero: true,
              data_emissao: true,
              emitente: true,
              remetente: true,
              total_liquido: true,
              quantidade_parcela: true,
              registerTribute: {
                select: {
                  id: true,
                  tipo: true,
                  valor: true,
                  tribute: {
                    select: {
                      id: true,
                      descricao: true,
                    },
                  },
                },
              },
              items: {
                select: {
                  quantidade: true,
                  preco_unitario: true,
                  id_insumo: true,
                  vinculo: true,
                  compositionItem: {
                    select: {
                      id: true,
                      composicao: true,
                      descricao: true,
                      compositionGroup: {
                        select: {
                          id: true,
                          composicao: true,
                          descricao: true,
                          costCenter: {
                            select: {
                              ID: true,
                              centro_custo: true,
                              descricao: true,
                            },
                          },
                        },
                      },
                    },
                  },
                  material: {
                    select: {
                      id: true,
                      material: true,
                    },
                  },
                  input: {
                    select: {
                      id: true,
                      insumo: true,
                    },
                  },
                },
              },
            },
          },
        },
        where: whereReceive,
      });

      return account;
    }
  }
}
