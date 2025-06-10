import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  IFinancePayment,
  IGroupByDate,
  IItemFindTemplate,
  IListFinanceByDateAndDirection,
  IListTotalPaymentTemplate,
  IListViewExpressByDateAndClient,
  IListViewReceiveByDateAndClient,
  IRawGroupByDateByDirectionAndCostCenter,
  IListItemsByDateAndDirectionAndDescriptionCostCenter,
} from 'src/models/IFinancePayment';
import { FinancePaymentRepository } from '../finance-payment-repository';
import {
  Prisma,
  smartnewsystem_financeiro_descricao_titulos_status,
  smartnewsystem_financeiro_titulo_pagamento,
} from '@prisma/client';

@Injectable()
export class FinancePaymentRepositoryPrisma
  implements FinancePaymentRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_financeiro_titulo_pagamento;

  async create(
    data: Prisma.smartnewsystem_financeiro_titulo_pagamentoUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_titulo_pagamento> {
    const payment = await this.table.create({
      data,
    });

    return payment;
  }

  async findById(id: number): Promise<IFinancePayment['findById'] | null> {
    const payment = await this.table.findUnique({
      select: {
        id: true,
        parcela: true,
        status: true,
        vencimento: true,
        prorrogacao: true,
        valor_a_pagar: true,
        valor_parcela: true,
        acrescimo: true,
        motivo_acrescimo: true,
        desconto: true,
        motivo_desconto: true,
        statusPay: {
          select: {
            id: true,
            descricao: true,
          },
        },
        finance: {
          select: {
            id: true,
            numero_fiscal: true,
            documento_numero: true,
            direcao: true,
            financeControl: {
              select: {
                issuePay: {
                  select: {
                    ID: true,
                    razao_social: true,
                  },
                },
                issueReceive: {
                  select: {
                    ID: true,
                    filial_numero: true,
                  },
                },
                senderPay: {
                  select: {
                    ID: true,
                    filial_numero: true,
                  },
                },
                senderReceive: {
                  select: {
                    ID: true,
                    razao_social: true,
                  },
                },
              },
            },
          },
        },
        emissionItem: {
          select: {
            emission: {
              select: {
                id: true,
                pago: true,
                bank: {
                  select: {
                    id: true,
                    nome: true,
                    saldo: true,
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

    return payment;
  }

  async findByFinance(
    financeId: number,
  ): Promise<IFinancePayment['findByFinance'][]> {
    const payment = await this.table.findMany({
      select: {
        id: true,
        parcela: true,
        vencimento: true,
        valor_a_pagar: true,
        acrescimo: true,
        desconto: true,
        valor_parcela: true,
        prorrogacao: true,
        status: true,
        statusPay: {
          select: {
            id: true,
            descricao: true,
          },
        },
        emissionItem: {
          select: {
            emission: {
              select: {
                data_vencimento: true,
                pago: true,
              },
            },
          },
        },
        emissionTaxation: {
          select: {
            tipo: true,
            valor: true,
            observacao: true,
          },
        },
      },
      where: {
        id_titulo: financeId,
      },
    });

    return payment;
  }

  async findByIds(
    id: number[],
  ): Promise<IFinancePayment['findByIds'][] | null> {
    const payment = await this.table.findMany({
      select: {
        id: true,
        parcela: true,
        vencimento: true,
        prorrogacao: true,
        valor_a_pagar: true,
        valor_parcela: true,
        acrescimo: true,
        motivo_acrescimo: true,
        desconto: true,
        motivo_desconto: true,
        finance: {
          select: {
            id: true,
            numero_fiscal: true,
            documento_numero: true,
            direcao: true,
            financeControl: {
              select: {
                issuePay: {
                  select: {
                    ID: true,
                    razao_social: true,
                  },
                },
                issueReceive: {
                  select: {
                    ID: true,
                    filial_numero: true,
                  },
                },
                senderPay: {
                  select: {
                    ID: true,
                    filial_numero: true,
                  },
                },
                senderReceive: {
                  select: {
                    ID: true,
                    razao_social: true,
                  },
                },
              },
            },
          },
        },
        emissionItem: {
          select: {
            emission: {
              select: {
                id: true,
                pago: true,
                data_vencimento: true,
                id_banco: true,
                bank: {
                  select: {
                    id: true,
                    nome: true,
                    saldo: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id: {
          in: id,
        },
      },
    });

    return payment;
  }

  async sumSplit(id: number[]): Promise<number> {
    const payment = await this.table.aggregate({
      _sum: {
        valor_parcela: true,
      },
      where: {
        id: {
          in: id,
        },
      },
    });

    return payment._sum.valor_parcela ?? 0;
  }

  async sumByFinance(financeId: number): Promise<number> {
    const payment = await this.table.aggregate({
      _sum: {
        valor_parcela: true,
      },
      where: {
        id_titulo: financeId,
      },
    });

    return payment._sum.valor_parcela || 0;
  }

  async findIfWithEmission(
    id: number[],
  ): Promise<IFinancePayment['findIfWithEmission'][]> {
    const payment = await this.table.findMany({
      select: {
        id: true,
        parcela: true,
        vencimento: true,
        prorrogacao: true,
        valor_a_pagar: true,
        valor_parcela: true,
        motivo_acrescimo: true,
        motivo_desconto: true,
        finance: {
          select: {
            id: true,
            numero_fiscal: true,
            documento_numero: true,
            direcao: true,
            financeControl: {
              select: {
                issuePay: {
                  select: {
                    ID: true,
                    razao_social: true,
                  },
                },
                issueReceive: {
                  select: {
                    ID: true,
                    filial_numero: true,
                  },
                },
                senderPay: {
                  select: {
                    ID: true,
                    filial_numero: true,
                  },
                },
                senderReceive: {
                  select: {
                    ID: true,
                    razao_social: true,
                  },
                },
              },
            },
          },
        },
        emissionItem: {
          select: {
            emission: {
              select: {
                id: true,
                pago: true,
              },
            },
          },
        },
      },
      where: {
        emissionItem: {
          id_pagamento: {
            in: id,
          },
        },
      },
    });

    return payment;
  }

  async listViewExpressByDateAndClient(
    clientId: number,
    startDate: string,
    endDate: string,
    costCenterId: number[],
    issued: boolean,
  ): Promise<IListViewExpressByDateAndClient[]> {
    const forDateOrIssued = issued ? 'data_vencimento' : 'prorrogacao';
    const forPay = issued ? 'and svfp.status = 3 ' : '';

    const payment: IListViewExpressByDateAndClient[] = await this.prismaService
      .$queryRaw`
      select
        svfp.id,
        svfp.valor_a_pagar,
        svfp.valor_parcela,
        sftd.total,
        sci.id as composition_item_id,
        sci.composicao as composition_item_composicao,
        sci.descricao as composition_item_descricao,
        scg.id as composition_group_id,
        scg.composicao as  composition_group_composicao,
        scg.descricao as  composition_group_descricao,
        cdcdc.ID as costCenter_ID,
        cdcdc.centro_custo as costCenter_code,
        cdcdc.descricao as costCenter_descricao,
        sdcc.id                   as descriptionCostCenter_id,
        sdcc.descricao_centro_custo as descriptionCostCenter_name,
        cdf.ID                    as branch_id,
        cdf.filial_numero         as branch_name,
        (
          if(
            sftd.id_material is null,
            (select scm.material from sofman_cad_materiais scm where scm.id = sftd.id_insumo),
            (select scm.material from sofman_cad_materiais scm where scm.id = sftd.id_material)
            )
        ) material,
        #scm.material,
        svfp.parcela,
        svfp.prorrogacao,
        svfp.vencimento,
        svfp.remetente,
        svfp.emitente,
        svfp.numero_fiscal,
        svfp.data_vencimento
      from smartnewsystem_view_financeiro_pagar svfp
      join smartnewsystem_financeiro_titulos_dados sftd	on sftd.id_titulo = svfp.id_titulo
      join smartnewsystem_composicao_item sci 			on sci.id = sftd.id_item_centro_custo
      join smartnewsystem_composicao_grupo scg 			on scg.id = sci.id_centro_custo
      join cadastro_de_centros_de_custo cdcdc 			on cdcdc.ID = scg.id_centro_custo
      join sofman_descricao_centro_custo sdcc 			on sdcc.id = cdcdc.ID_centro_custo
      join cadastro_de_filiais cdf 						      on sdcc.id_filial = cdf.ID
      #left join sofman_cad_materiais scm 						on scm.id = sftd.id_insumo
      where svfp.${Prisma.sql([forDateOrIssued])} BETWEEN '${Prisma.sql([
        startDate,
      ])}' and '${Prisma.sql([endDate])}'
      and svfp.id_cliente = ${clientId}
      and sdcc.ID in ( ${Prisma.sql([costCenterId.join(',')])} )
      ${Prisma.sql([forPay])}
      #group by svfp.id
    `;

    return payment;
  }

  async listViewReceiveByDateAndClient(
    clientId: number,
    startDate: string,
    endDate: string,
    costCenterId: number[],
    issued: boolean,
  ): Promise<IListViewReceiveByDateAndClient[]> {
    const forDateOrIssued = issued ? 'data_vencimento' : 'prorrogacao';
    const forPay = issued ? 'and svfr.status = 3 ' : '';

    const payment: IListViewReceiveByDateAndClient[] = await this.prismaService
      .$queryRaw`
      select
        svfr.id,
        svfr.valor_a_pagar,
        svfr.valor_parcela,
        sftd.total,
        sci.id as composition_item_id,
        sci.composicao as composition_item_composicao,
        sci.descricao as composition_item_descricao,
        scg.id as composition_group_id,
        scg.composicao as  composition_group_composicao,
        scg.descricao as  composition_group_descricao,
        cdcdc.ID as costCenter_ID,
        cdcdc.centro_custo as costCenter_code,
        cdcdc.descricao as costCenter_descricao,
        sdcc.id                   as descriptionCostCenter_id,
        sdcc.descricao_centro_custo as descriptionCostCenter_name,
        cdf.ID                    as branch_id,
        cdf.filial_numero         as branch_name,
        scti.insumo,
        svfr.parcela,
        svfr.prorrogacao,
        svfr.vencimento,
        svfr.remetente,
        svfr.emitente,
        svfr.numero_fiscal,
        svfr.data_vencimento
      from smartnewsystem_view_financeiro_receber svfr
      join smartnewsystem_financeiro_titulos_dados sftd	on sftd.id_titulo = svfr.id_titulo
      join smartnewsystem_composicao_item sci 			on sci.id = sftd.id_item_centro_custo
      join smartnewsystem_composicao_grupo scg 			on scg.id = sci.id_centro_custo
      join cadastro_de_centros_de_custo cdcdc 			on cdcdc.ID = scg.id_centro_custo
      join sofman_descricao_centro_custo sdcc 			on sdcc.id = cdcdc.ID_centro_custo
      join cadastro_de_filiais cdf 						      on sdcc.id_filial = cdf.ID
      join smartnewsystem_contrato_tipo_insumo scti on scti.id = sftd.id_insumo
      where svfr.${Prisma.sql([forDateOrIssued])} BETWEEN '${Prisma.sql([
        startDate,
      ])}' and '${Prisma.sql([endDate])}'
      and svfr.id_cliente = ${clientId}
      and sdcc.ID in ( ${Prisma.sql([costCenterId.join(',')])} )
      ${Prisma.sql([forPay])}
      #group by svfr.id
    `;

    return payment;
  }

  async sumViewExpressByDateAndClient(
    startDate: string,
    endDate: string,
    clientId: number,
    costCenterId: number[],
    issued: boolean,
  ): Promise<number> {
    const forDateOrIssued = issued ? 'data_vencimento' : 'prorrogacao';

    const payment: { valor_parcela: number } = await this.prismaService
      .$queryRaw`
      select
        sum(if(EXISTS(select sftd.id from smartnewsystem_financeiro_titulos_dados sftd
              join smartnewsystem_composicao_item sci on sci.id = sftd.id_item_centro_custo
              join smartnewsystem_composicao_grupo scg on scg.id = sci.id_centro_custo
              join cadastro_de_centros_de_custo cdcdc on cdcdc.id = scg.id_centro_custo
              join sofman_descricao_centro_custo sdcc on sdcc.id = cdcdc.ID_centro_custo
              where sftd.id_titulo = svfr.id_titulo
              and sdcc.ID in ( ${Prisma.sql([costCenterId.join(',')])} )
        ),svfr.valor_parcela,0)) valor_parcela
      from smartnewsystem_view_financeiro_pagar svfr
      where svfr.${Prisma.sql([forDateOrIssued])} BETWEEN '${Prisma.sql([
        startDate,
      ])}' and '${Prisma.sql([endDate])}'
      and svfr.id_cliente = ${clientId}
    `;

    return payment[0].valor_parcela || 0;
  }

  async sumViewExpressByDateAndClientAndPay(
    startDate: string,
    endDate: string,
    clientId: number,
    costCenterId: number[],
    status: number[],
    issued: boolean,
  ): Promise<number> {
    const forDateOrIssued = issued ? 'data_vencimento' : 'prorrogacao';

    const payment: { valor_parcela: number } = await this.prismaService
      .$queryRaw`
      select
        sum(if(EXISTS(select sftd.id from smartnewsystem_financeiro_titulos_dados sftd
              join smartnewsystem_composicao_item sci on sci.id = sftd.id_item_centro_custo
              join smartnewsystem_composicao_grupo scg on scg.id = sci.id_centro_custo
              join cadastro_de_centros_de_custo cdcdc on cdcdc.id = scg.id_centro_custo
              join sofman_descricao_centro_custo sdcc on sdcc.id = cdcdc.ID_centro_custo
              where sftd.id_titulo = svfr.id_titulo
              and sdcc.ID in ( ${Prisma.sql([costCenterId.join(',')])} )
        ),svfr.valor_parcela,0)) valor_parcela
      from smartnewsystem_view_financeiro_pagar svfr
      where svfr.${Prisma.sql([forDateOrIssued])} BETWEEN '${Prisma.sql([
        startDate,
      ])}' and '${Prisma.sql([endDate])}'
      and svfr.id_cliente = ${clientId}
      and svfr.status in (${Prisma.sql([status.join(',')])})
    `;

    return payment[0].valor_parcela || 0;
  }

  async sumViewReceiveByDateAndClient(
    startDate: string,
    endDate: string,
    clientId: number,
    costCenterId: number[],
    issued: boolean,
  ): Promise<number> {
    const forDateOrIssued = issued ? 'data_vencimento' : 'prorrogacao';

    const payment: { valor_parcela: number } = await this.prismaService
      .$queryRaw`
      select
        sum(if(EXISTS(select sftd.id from smartnewsystem_financeiro_titulos_dados sftd
              join smartnewsystem_composicao_item sci on sci.id = sftd.id_item_centro_custo
              join smartnewsystem_composicao_grupo scg on scg.id = sci.id_centro_custo
              join cadastro_de_centros_de_custo cdcdc on cdcdc.id = scg.id_centro_custo
              join sofman_descricao_centro_custo sdcc on sdcc.id = cdcdc.ID_centro_custo
              where sftd.id_titulo = svfr.id_titulo
              and sdcc.ID in ( ${Prisma.sql([costCenterId.join(',')])} )
        ),svfr.valor_parcela,0)) valor_parcela
      from smartnewsystem_view_financeiro_receber svfr
      where svfr.${Prisma.sql([forDateOrIssued])} BETWEEN '${Prisma.sql([
        startDate,
      ])}' and '${Prisma.sql([endDate])}'
      and svfr.id_cliente = ${clientId}
    `;

    return payment[0].valor_parcela || 0;
  }

  async sumViewReceiveByDateAndClientAndPay(
    startDate: string,
    endDate: string,
    clientId: number,
    costCenterId: number[],
    status: number[],
    issued: boolean,
  ): Promise<number> {
    const forDateOrIssued = issued ? 'data_vencimento' : 'prorrogacao';

    const payment: { valor_parcela: number } = await this.prismaService
      .$queryRaw`
      select
        sum(if(EXISTS(select sftd.id from smartnewsystem_financeiro_titulos_dados sftd
              join smartnewsystem_composicao_item sci on sci.id = sftd.id_item_centro_custo
              join smartnewsystem_composicao_grupo scg on scg.id = sci.id_centro_custo
              join cadastro_de_centros_de_custo cdcdc on cdcdc.id = scg.id_centro_custo
              join sofman_descricao_centro_custo sdcc on sdcc.id = cdcdc.ID_centro_custo
              where sftd.id_titulo = svfr.id_titulo
              and sdcc.ID in ( ${Prisma.sql([costCenterId.join(',')])} )
        ),svfr.valor_parcela,0)) valor_parcela
      from smartnewsystem_view_financeiro_receber svfr
      where svfr.${Prisma.sql([forDateOrIssued])} BETWEEN '${Prisma.sql([
        startDate,
      ])}' and '${Prisma.sql([endDate])}'
      and svfr.id_cliente = ${clientId}
      and svfr.status in (${Prisma.sql([status.join(',')])})
    `;

    return payment[0].valor_parcela || 0;
  }

  async aggregateSumByCostCenterAndStatusAndPay(
    clientId: number,
    direction: 'pagar' | 'receber',
    costCenterId: number[],
    startDate: Date,
    endDate: Date,
    status: smartnewsystem_financeiro_descricao_titulos_status[],
    pay?: number[],
  ): Promise<number> {
    const payment = await this.table.aggregate({
      _sum: {
        valor_parcela: true,
      },
      where: {
        finance: {
          direcao: direction,
          id_cliente: clientId,
          status: {
            in: status,
          },
          items: {
            some: {
              compositionItem: {
                compositionGroup: {
                  costCenter: {
                    ID: {
                      in: costCenterId,
                    },
                  },
                },
              },
            },
          },
        },
        prorrogacao: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          in: pay,
        },
      },
    });

    return payment?._sum.valor_parcela || 0;
  }

  async aggregateSumByFinance(financeId: number): Promise<number> {
    const payment = await this.table.aggregate({
      _sum: {
        valor_parcela: true,
      },
      where: {
        id_titulo: financeId,
      },
    });

    return payment?._sum.valor_parcela || 0;
  }

  async listItemsByDateAndDirectionAndDescriptionCostCenter(
    clientId: number,
    startDate: Date,
    endDate: Date,
    direction: 'pagar' | 'receber',
    descriptionCostCenterId: number[],
  ): Promise<IListItemsByDateAndDirectionAndDescriptionCostCenter[]> {
    const payment = await this.table.findMany({
      select: {
        id: true,
        vencimento: true,
        prorrogacao: true,
        parcela: true,
        valor_parcela: true,
        emissionItem: {
          select: {
            id: true,
            emission: {
              select: {
                id: true,
                data_vencimento: true,
              },
            },
          },
        },
        finance: {
          select: {
            id: true,
            documento_numero: true,
            numero_fiscal: true,
            data_emissao: true,
            total_liquido: true,
            observacoes: true,
            quantidade_parcela: true,
            remetente: true,
            emitente: true,
            paymentType: {
              select: {
                id: true,
                descricao: true,
              },
            },
            financeControl: {
              select: {
                issueReceive: {
                  select: {
                    nome_fantasia: true,
                  },
                },
                senderReceive: {
                  select: {
                    nome_fantasia: true,
                  },
                },
                issuePay: {
                  select: {
                    nome_fantasia: true,
                  },
                },
                senderPay: {
                  select: {
                    nome_fantasia: true,
                  },
                },
              },
            },
            items: {
              select: {
                id: true,
                total: true,
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
                            descriptionCostCenter: {
                              select: {
                                id: true,
                                descricao_centro_custo: true,
                                branch: {
                                  select: {
                                    ID: true,
                                    filial_numero: true,
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
                material: {
                  select: {
                    material: true,
                  },
                },
                input: {
                  select: {
                    insumo: true,
                  },
                },
                equipment: {
                  select: {
                    ID: true,
                    equipamento_codigo: true,
                    descricao: true,
                  },
                },
                order: {
                  select: {
                    ID: true,
                    ordem: true,
                    descricao_solicitacao: true,
                    equipment: {
                      select: {
                        ID: true,
                        equipamento_codigo: true,
                        descricao: true,
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
        prorrogacao: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          in: [1, 2],
        },
        finance: {
          id_cliente: clientId,
          direcao: direction,
          items: {
            some: {
              compositionItem: {
                compositionGroup: {
                  costCenter: {
                    descriptionCostCenter: {
                      id: {
                        in: descriptionCostCenterId,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return payment;
  }

  async listItemsByDateAndDirectionAndDescriptionCostCenterAndPay(
    clientId: number,
    startDate: Date,
    endDate: Date,
    direction: 'pagar' | 'receber',
    descriptionCostCenterId: number[],
    bankId?: number[],
  ): Promise<IListItemsByDateAndDirectionAndDescriptionCostCenter[]> {
    const payment = await this.table.findMany({
      distinct: 'id',
      select: {
        id: true,
        vencimento: true,
        prorrogacao: true,
        parcela: true,
        valor_parcela: true,
        emissionItem: {
          select: {
            id: true,
            emission: {
              select: {
                id: true,
                data_vencimento: true,
              },
            },
          },
        },
        finance: {
          select: {
            id: true,
            documento_numero: true,
            numero_fiscal: true,
            data_emissao: true,
            total_liquido: true,
            observacoes: true,
            quantidade_parcela: true,
            remetente: true,
            emitente: true,
            paymentType: {
              select: {
                id: true,
                descricao: true,
              },
            },
            financeControl: {
              select: {
                issueReceive: {
                  select: {
                    nome_fantasia: true,
                  },
                },
                senderReceive: {
                  select: {
                    nome_fantasia: true,
                  },
                },
                issuePay: {
                  select: {
                    nome_fantasia: true,
                  },
                },
                senderPay: {
                  select: {
                    nome_fantasia: true,
                  },
                },
              },
            },
            items: {
              select: {
                id: true,
                total: true,
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
                            descriptionCostCenter: {
                              select: {
                                id: true,
                                descricao_centro_custo: true,
                                branch: {
                                  select: {
                                    ID: true,
                                    filial_numero: true,
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
                material: {
                  select: {
                    material: true,
                  },
                },
                input: {
                  select: {
                    insumo: true,
                  },
                },
                equipment: {
                  select: {
                    ID: true,
                    equipamento_codigo: true,
                    descricao: true,
                  },
                },
                order: {
                  select: {
                    ID: true,
                    ordem: true,
                    descricao_solicitacao: true,
                    equipment: {
                      select: {
                        ID: true,
                        equipamento_codigo: true,
                        descricao: true,
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
        AND: [
          {
            status: 3,
            emissionItem: {
              is: {
                emission: {
                  data_vencimento: {
                    gte: startDate,
                    lte: endDate,
                  },
                  ...(bankId && { bank: { id: { in: bankId } } }),
                },
              },
            },
          },
          {
            finance: {
              id_cliente: clientId,
              direcao: direction,
              items: {
                some: {
                  compositionItem: {
                    compositionGroup: {
                      costCenter: {
                        descriptionCostCenter: {
                          id: {
                            in: descriptionCostCenterId,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    });

    return payment;
  }

  async listFinanceByDateAndDirection(
    startDate: Date,
    endDate: Date,
    direction: 'pagar' | 'receber',
  ): Promise<IListFinanceByDateAndDirection[]> {
    const financePayment = await this.table.findMany({
      select: {
        finance: {
          select: {
            id: true,
          },
        },
      },
      where: {
        prorrogacao: {
          gte: startDate,
          lte: endDate,
        },
        finance: {
          direcao: direction,
        },
      },
    });

    return financePayment;
  }

  async listFinanceByDateAndDirectionAndCostCenter(
    startDate: Date,
    endDate: Date,
    direction: 'pagar' | 'receber',
    costCenterId: number[],
  ): Promise<IListFinanceByDateAndDirection[]> {
    const financePayment = await this.table.findMany({
      select: {
        finance: {
          select: {
            id: true,
          },
        },
      },
      where: {
        prorrogacao: {
          gte: startDate,
          lte: endDate,
        },
        finance: {
          direcao: direction,
          items: {
            some: {
              compositionItem: {
                compositionGroup: {
                  costCenter: {
                    ID: {
                      in: costCenterId,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return financePayment;
  }

  async groupByDateAndDirectionAndFinance(
    startDate: Date,
    endDate: Date,
    direction: 'pagar' | 'receber',
    financeId: number[],
  ): Promise<IGroupByDate[]> {
    const payment = await this.table.groupBy({
      by: 'id_titulo',
      _sum: {
        valor_parcela: true,
      },
      where: {
        prorrogacao: {
          gte: startDate,
          lte: endDate,
        },
        finance: {
          direcao: direction,
          id: {
            in: financeId,
          },
        },
      },
    });

    return payment;
  }

  async groupByDateAndDirectionAndCostCenter(
    startDate: Date,
    endDate: Date,
    direction: 'pagar' | 'receber',
    costCenterId: number[],
  ): Promise<IGroupByDate[]> {
    const payment = await this.table.groupBy({
      by: 'id_titulo',
      _sum: {
        valor_parcela: true,
      },
      where: {
        prorrogacao: {
          gte: startDate,
          lte: endDate,
        },
        finance: {
          direcao: direction,
          items: {
            some: {
              compositionItem: {
                compositionGroup: {
                  costCenter: {
                    ID: {
                      in: costCenterId,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return payment;
  }

  async groupByDateAndDirection(
    startDate: Date,
    endDate: Date,
    direction: 'pagar' | 'receber',
  ): Promise<IGroupByDate[]> {
    const payment = await this.table.groupBy({
      by: 'id_titulo',
      _sum: {
        valor_parcela: true,
      },
      where: {
        prorrogacao: {
          gte: startDate,
          lte: endDate,
        },
        finance: {
          direcao: direction,
        },
      },
    });

    return payment;
  }

  async groupByDateByDirectionAndCostCenter(
    startDate: Date,
    endDate: Date,
    direction: 'pagar' | 'receber',
    costCenterId: number[],
  ): Promise<IGroupByDate[]> {
    const payment = await this.table.groupBy({
      by: ['id_titulo'],
      _sum: {
        valor_parcela: true,
      },
      where: {
        prorrogacao: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const newPayment = [];

    for await (const item of payment) {
      const finance = await this.table.findFirst({
        where: {
          finance: {
            id: item.id_titulo,
            direcao: direction,
            items: {
              some: {
                compositionItem: {
                  compositionGroup: {
                    costCenter: {
                      ID: {
                        in: costCenterId,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (finance) {
        newPayment.push(item);
      }
    }

    return newPayment;
  }

  async rawGroupByDateByDirectionAndCostCenter(
    startDate: Date,
    endDate: Date,
    direction: 'pagar' | 'receber',
    costCenterId: string,
  ): Promise<IRawGroupByDateByDirectionAndCostCenter[]> {
    const listTotalPayment: IListTotalPaymentTemplate[] = await this
      .prismaService.$queryRaw`
      select
        sum(valor_parcela) totalSplit,
        dt.id financeId,
        (SELECT
          sum(total)
        FROM smartnewsystem_financeiro_titulos_dados
        where id_titulo = dt.id) as totalFinance
        from smartnewsystem_financeiro_titulo_pagamento tp
				join smartnewsystem_financeiro_descricao_titulos dt on dt.id = tp.id_titulo
				where dt.direcao = ${direction}
				and tp.prorrogacao between ${startDate} and ${endDate}
				and dt.id in (
          select sftd.id_titulo from smartnewsystem_financeiro_titulos_dados sftd
          join smartnewsystem_composicao_item sci on sci.id = sftd.id_item_centro_custo
          join smartnewsystem_composicao_grupo scg on scg.id = sci.id_centro_custo
          join cadastro_de_centros_de_custo cdcdc on cdcdc.id = scg.id_centro_custo
          where cdcdc.id in ( ${costCenterId} )
        )
				group by dt.id
    `;

    const newPayment = [];

    for await (const item of listTotalPayment) {
      const itemFind: IItemFindTemplate = await this.prismaService.$queryRaw`
        select
						i.id as compositionItemId,
						g.id as compositionGroupId,
						td.total as totalItem,
						i.composicao as compositionItemCode,
						i.descricao as compositionItemDescription,
						g.composicao as compositionGroupCode,
						g.descricao as compositionGroupDescription,
						td.id as itemId,
						cdcdc.id as costCenterId,
						cdcdc.centro_custo as costCenterCode,
						cdcdc.descricao as costCenterDescription,
						cdf.filial_numero as branchDescription,
						cdf.id as branchId
					from smartnewsystem_financeiro_titulos_dados td
					join smartnewsystem_composicao_item i on i.id = td.id_item_centro_custo
					join smartnewsystem_composicao_grupo g on g.id = i.id_centro_custo
					join cadastro_de_centros_de_custo cdcdc on cdcdc.id = g.id_centro_custo
					join sofman_descricao_centro_custo sdcc on sdcc.id = cdcdc.ID_centro_custo
					join cadastro_de_filiais cdf on cdf.id = sdcc.id_filial
					where td.id_titulo = ${item.financeId}
					and cdcdc.id in ( ${costCenterId} )
      `;

      newPayment.push({
        ...item,
        ...itemFind[0],
      });
    }

    return newPayment;
  }

  async rawGroupByDateByDirection(
    startDate: Date,
    endDate: Date,
    direction: 'pagar' | 'receber',
  ): Promise<IRawGroupByDateByDirectionAndCostCenter[]> {
    const listTotalPayment: IListTotalPaymentTemplate[] = await this
      .prismaService.$queryRaw`
      select
        sum(valor_parcela) totalSplit,
        dt.id financeId,
        (SELECT
          sum(total)
        FROM smartnewsystem_financeiro_titulos_dados
        where id_titulo = dt.id) as totalFinance
        from smartnewsystem_financeiro_titulo_pagamento tp
				join smartnewsystem_financeiro_descricao_titulos dt on dt.id = tp.id_titulo
				where dt.direcao = ${direction}
				and tp.prorrogacao between ${startDate} and ${endDate}
				group by dt.id
    `;

    const newPayment = [];

    for await (const item of listTotalPayment) {
      const itemFind: IItemFindTemplate[] = await this.prismaService.$queryRaw`
        select
						i.id as compositionItemId,
						g.id as compositionGroupId,
						td.total as totalItem,
						i.composicao as compositionItemCode,
						i.descricao as compositionItemDescription,
						g.composicao as compositionGroupCode,
						g.descricao as compositionGroupDescription,
						td.id as itemId,
						cdcdc.id as costCenterId,
						cdcdc.centro_custo as costCenterCode,
						cdcdc.descricao as costCenterDescription,
						cdf.filial_numero as branchDescription,
						cdf.id as branchId
					from smartnewsystem_financeiro_titulos_dados td
					join smartnewsystem_composicao_item i on i.id = td.id_item_centro_custo
					join smartnewsystem_composicao_grupo g on g.id = i.id_centro_custo
					join cadastro_de_centros_de_custo cdcdc on cdcdc.id = g.id_centro_custo
					join sofman_descricao_centro_custo sdcc on sdcc.id = cdcdc.ID_centro_custo
					join cadastro_de_filiais cdf on cdf.id = sdcc.id_filial
					where td.id_titulo = ${item.financeId}
      `;

      if (itemFind.length) {
        newPayment.push({
          ...item,
          ...itemFind[0],
        });
      }
    }

    return newPayment;
  }

  async findLastByTitleAndDate(
    titleId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<smartnewsystem_financeiro_titulo_pagamento | null> {
    const payment = await this.table.findFirst({
      where: {
        id_titulo: titleId,
        prorrogacao: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    return payment;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_financeiro_titulo_pagamentoUncheckedUpdateInput,
  ): Promise<smartnewsystem_financeiro_titulo_pagamento> {
    const payment = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return payment;
  }

  async updateStatusToExpired(clientId: number): Promise<boolean> {
    await this.prismaService.$executeRaw`
      update smartnewsystem_financeiro_titulo_pagamento tp
      join smartnewsystem_financeiro_descricao_titulos dt on dt.id = tp.id_titulo
      set tp.status = 2
      where tp.vencimento < now()
      and tp.status = 1
      and dt.id_cliente = ${clientId}
      and dt.status != 'ABERTO';
    `;

    return true;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id,
      },
    });

    return true;
  }

  async deleteByFinance(financeId: number): Promise<boolean> {
    await this.table.deleteMany({
      where: {
        id_titulo: financeId,
      },
    });

    return true;
  }
}
