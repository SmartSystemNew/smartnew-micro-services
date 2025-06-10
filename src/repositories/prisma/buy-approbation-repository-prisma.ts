import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_compras_aprovacao } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import BuyApprobationRepository from '../buy-approbation-repository';
import IBuyApprobation from 'src/models/IBuyApprobation';
import { MessageService } from 'src/service/message.service';
import { DateService } from 'src/service/data.service';

@Injectable()
export default class BuyApprobationRepositoryPrisma
  implements BuyApprobationRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_aprovacao;

  async listByUserAndOpen(
    user: string,
  ): Promise<smartnewsystem_compras_aprovacao[]> {
    const buyApprobations = await this.table.findMany({
      where: {
        aprovado: {
          not: 1,
        },
        aprovador: user,
      },
    });

    return buyApprobations;
  }

  async findByBuyAndUser(
    buyId: number,
    user: string,
  ): Promise<smartnewsystem_compras_aprovacao | null> {
    const buyApprobations = await this.table.findFirst({
      where: {
        id_compra: buyId,
        aprovador: user,
      },
    });

    return buyApprobations;
  }

  async findById(id: number): Promise<IBuyApprobation['findById'] | null> {
    const buyApprobations = await this.table.findFirst({
      select: {
        id: true,
        aprovado: true,
        log_date: true,
        buy: {
          select: {
            id: true,
            numero: true,
            fechamento: true,
            observacao: true,
            item: {
              select: {
                id: true,
                estoque: true,
              },
            },
            quotationSelected: {
              select: {
                id: true,
                quotationItem: {
                  select: {
                    id: true,
                    quantidade: true,
                    valor: true,
                    item: {
                      select: {
                        id: true,
                        vinculo: true,
                        material: {
                          select: {
                            id: true,
                            material: true,
                          },
                        },
                        compositionItem: {
                          select: {
                            id: true,
                          },
                        },
                        equipment: {
                          select: {
                            ID: true,
                          },
                        },
                        serviceOrder: {
                          select: {
                            ID: true,
                          },
                        },
                      },
                    },
                    quotation: {
                      select: {
                        id: true,
                        provider: {
                          select: {
                            ID: true,
                            nome_fantasia: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            branch: {
              select: {
                ID: true,
                filial_numero: true,
              },
            },
            buyStatus: {
              select: {
                id: true,
                descricao: true,
              },
            },
            userResponsible: {
              select: {
                login: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });

    return buyApprobations;
  }

  async listByBuy(buyId: number): Promise<IBuyApprobation['listByBuy'][]> {
    const buyApprobations = await this.table.findMany({
      select: {
        id: true,
        aprovado: true,
        log_date: true,
        buy: {
          select: {
            id: true,
            numero: true,
            fechamento: true,
            observacao: true,
            quotationSelected: {
              select: {
                id: true,
                quotationItem: {
                  select: {
                    id: true,
                    quantidade: true,
                    valor: true,
                    quotation: {
                      select: {
                        id: true,
                        provider: {
                          select: {
                            ID: true,
                            nome_fantasia: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            branch: {
              select: {
                ID: true,
                filial_numero: true,
              },
            },
            buyStatus: {
              select: {
                id: true,
                descricao: true,
              },
            },
            userResponsible: {
              select: {
                login: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        id_compra: buyId,
      },
    });

    return buyApprobations;
  }

  async everyoneApprovedBeforeMe(
    branchId: number,
    nivel: number,
    blank: string,
    login: string,
    buyId: number,
  ): Promise<boolean> {
    const allBuy = await this.table.findMany({
      where: {
        id_compra: buyId,
      },
    });

    const buyApprobations = await this.table.findMany({
      where: {
        aprovado: 1,
        id_compra: buyId,
        user: {
          elevation: {
            some: {
              aplicacao: blank,
              id_modulo: 9,
              id_filial: branchId,
              login: {
                not: login,
              },
              nivel: {
                lt: nivel,
              },
            },
          },
        },
      },
    });

    return allBuy.length === 1 ? true : buyApprobations.length > 0;
  }

  async listByBranchesAndLogin(
    branches: number[],
    login: string,
    blank: string,
    index: number,
    perPage: number,
    filter?: Prisma.smartnewsystem_compras_aprovacaoWhereInput,
  ): Promise<IBuyApprobation['listByBranchesAndLogin'][]> {
    //console.log(blank, nivel);

    const buyApprobations = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      skip: index * perPage,
      take: perPage,
      select: {
        id: true,
        aprovado: true,
        log_date: true,
        buy: {
          select: {
            id: true,
            numero: true,
            fechamento: true,
            observacao: true,
            quotationSelected: {
              select: {
                id: true,
                quotationItem: {
                  select: {
                    id: true,
                    quantidade: true,
                    valor: true,
                  },
                },
              },
            },
            branch: {
              select: {
                ID: true,
                filial_numero: true,
              },
            },
            buyStatus: {
              select: {
                id: true,
                descricao: true,
              },
            },
            userResponsible: {
              select: {
                login: true,
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            login: true,
            elevation: {
              select: {
                id: true,
                id_filial: true,
                nivel: true,
              },
              where: {
                aplicacao: blank,
                id_modulo: 9,
                id_filial: {
                  in: branches,
                },
              },
            },
          },
        },
      },
      where: {
        user: {
          login,
        },
        buy: {
          branch: {
            ID: {
              in: branches,
            },
          },
        },
        ...filter,
      },
    });

    return buyApprobations;
  }

  async countListByBranchesAndLogin(
    branches: number[],
    login: string,
    filter?: Prisma.smartnewsystem_compras_aprovacaoWhereInput,
  ): Promise<number> {
    //console.log(blank, nivel);
    const buyApprobations = await this.table.aggregate({
      _count: true,
      where: {
        user: {
          login,
        },
        buy: {
          branch: {
            ID: {
              in: branches,
            },
          },
        },
        ...filter,
      },
    });

    return buyApprobations._count || 0;
  }

  async listByBranches(
    branches: number[],
    login: string,
    blank: string,
    nivel: number,
    index: number,
    perPage: number,
    filter?: Prisma.smartnewsystem_compras_aprovacaoWhereInput,
  ): Promise<IBuyApprobation['listByBranches'][]> {
    //console.log(blank, nivel);
    const buyApprobations = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      skip: index * perPage,
      take: perPage,
      select: {
        id: true,
        aprovado: true,
        log_date: true,
        buy: {
          select: {
            id: true,
            numero: true,
            fechamento: true,
            observacao: true,
            quotationSelected: {
              select: {
                id: true,
                quotationItem: {
                  select: {
                    id: true,
                    quantidade: true,
                    valor: true,
                  },
                },
              },
            },
            branch: {
              select: {
                ID: true,
                filial_numero: true,
              },
            },
            buyStatus: {
              select: {
                id: true,
                descricao: true,
              },
            },
            userResponsible: {
              select: {
                login: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        user: {
          login,
        },
        buy: {
          branch: {
            ID: {
              in: branches,
            },
          },
        },
        OR: [
          {
            id_compra: {
              in: await this.table
                .findMany({
                  select: {
                    id: true,
                    id_compra: true,
                    aprovador: true,
                    buy: {
                      select: {
                        id: true,
                        numero: true,
                      },
                    },
                  },
                  where: {
                    OR: [
                      {
                        aprovado: 1,
                        user: {
                          elevation: {
                            some: {
                              aplicacao: blank,
                              id_modulo: 9,
                              id_filial: {
                                in: branches,
                              },
                              login: {
                                not: login,
                              },
                              nivel: {
                                lt: nivel,
                              },
                            },
                          },
                        },
                      },
                      {
                        user: {
                          elevation: {
                            some: {
                              aplicacao: blank,
                              id_modulo: 9,
                              id_filial: {
                                in: branches,
                              },
                              nivel: {
                                equals: nivel,
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                })
                .then((x) => {
                  //console.log(x);
                  return x.map((x) => x.id_compra);
                }),
            },

            // user: {
            //   smartnewsystem_alcadas: {
            //     none: {
            //       aplicacao: blank,
            //       id_modulo: 9,
            //       id_filial: {
            //         in: branches,
            //       },
            //       login: {
            //         not: login,
            //       },
            //       nivel: {
            //         lt: nivel,
            //       },
            //     },
            //   },
            // },
            //aprovado: 1,
          },
        ],
        ...filter,
      },
    });

    return buyApprobations;
  }

  async listByBranchesLastNivel(
    branches: number[],
    login: string,
    index: number,
    perPage: number,
    filter?: Prisma.smartnewsystem_compras_aprovacaoWhereInput,
  ): Promise<IBuyApprobation['listByBranchesLastNivel'][]> {
    //console.log(blank, nivel);
    const buyApprobations = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      skip: index * perPage,
      take: perPage,
      select: {
        id: true,
        aprovado: true,
        log_date: true,
        buy: {
          select: {
            id: true,
            numero: true,
            fechamento: true,
            observacao: true,
            quotationSelected: {
              select: {
                id: true,
                quotationItem: {
                  select: {
                    id: true,
                    quantidade: true,
                    valor: true,
                  },
                },
              },
            },
            branch: {
              select: {
                ID: true,
                filial_numero: true,
              },
            },
            buyStatus: {
              select: {
                id: true,
                descricao: true,
              },
            },
            userResponsible: {
              select: {
                login: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        user: {
          login,
        },
        buy: {
          branch: {
            ID: {
              in: branches,
            },
          },
        },
        ...filter,
      },
    });

    return buyApprobations;
  }

  async create(
    data: Prisma.smartnewsystem_compras_aprovacaoUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_aprovacao> {
    const buyApprobation = await this.table.create({ data });

    return buyApprobation;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_compras_aprovacaoUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_aprovacao> {
    const buyApprobation = await this.table.update({ where: { id }, data });

    return buyApprobation;
  }

  async updateRequest(
    clientId: number,
    login: string,
    ids: number[],
    approved: boolean,
    justify: string,
    signature: string,
    hasFinance: boolean,
  ): Promise<{ error: boolean; message: string; success: boolean }> {
    let response = {
      error: false,
      message: '',
      success: false,
    };
    await this.prismaService
      .$transaction(
        async (tx) => {
          const allBuy: IBuyApprobation['findById']['buy'][] = [];

          // Editar aprovacoes e guardar buy
          for await (const approbationId of ids) {
            const approbation =
              await tx.smartnewsystem_compras_aprovacao.findFirst({
                select: {
                  id: true,
                  aprovado: true,
                  log_date: true,
                  buy: {
                    select: {
                      id: true,
                      numero: true,
                      fechamento: true,
                      observacao: true,
                      quotationSelected: {
                        select: {
                          id: true,
                          quotationItem: {
                            select: {
                              id: true,
                              quantidade: true,
                              valor: true,
                              item: {
                                select: {
                                  id: true,
                                  vinculo: true,
                                  material: {
                                    select: {
                                      id: true,
                                      material: true,
                                    },
                                  },
                                  compositionItem: {
                                    select: {
                                      id: true,
                                    },
                                  },
                                  equipment: {
                                    select: {
                                      ID: true,
                                    },
                                  },
                                  serviceOrder: {
                                    select: {
                                      ID: true,
                                    },
                                  },
                                },
                              },
                              quotation: {
                                select: {
                                  id: true,
                                  provider: {
                                    select: {
                                      ID: true,
                                      nome_fantasia: true,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                      item: {
                        select: {
                          id: true,
                          estoque: true,
                        },
                      },
                      branch: {
                        select: {
                          ID: true,
                          filial_numero: true,
                        },
                      },
                      buyStatus: {
                        select: {
                          id: true,
                          descricao: true,
                        },
                      },
                      userResponsible: {
                        select: {
                          login: true,
                          name: true,
                        },
                      },
                    },
                  },
                },
                where: {
                  id: approbationId,
                },
              });

            if (!approbation) {
              throw {
                errorMessage: `Aprovação não encontrada com o ID ${approbationId}`,
                message: MessageService.Buy_approbation_id_not_found,
              };
            }

            await tx.smartnewsystem_compras_aprovacao.update({
              data: {
                aprovado: approved === true ? 1 : 0,
                observacao: justify,
                assinatura: Buffer.from(signature),
              },
              where: {
                id: approbation.id,
              },
            });

            const findBuyIndex = allBuy.findIndex(
              (find) => find.id === approbation.buy.id,
            );

            if (findBuyIndex === -1) {
              allBuy.push(approbation.buy);
            }
          }

          if (approved) {
            for await (const buy of allBuy) {
              const allBuyApprobation =
                await tx.smartnewsystem_compras_aprovacao.findMany({
                  where: {
                    id_compra: buy.id,
                  },
                });

              const allApproved = allBuyApprobation.every(
                (find) => find.aprovado === 1,
              );

              if (allApproved) {
                const allProvider = [];
                const allItemQuotation = [];

                for await (const quotationItemSelected of buy.quotationSelected) {
                  await tx.smartnewsystem_compras_cotacao_selecionada.update({
                    data: {
                      aprovado: 1,
                    },
                    where: {
                      id: quotationItemSelected.id,
                    },
                  });

                  const findProvider = allProvider.findIndex(
                    (find) =>
                      find ===
                      quotationItemSelected.quotationItem.quotation.provider.ID,
                  );

                  if (findProvider === -1) {
                    allProvider.push(
                      quotationItemSelected.quotationItem.quotation.provider.ID,
                    );
                  }

                  const findProviderItem = allItemQuotation.findIndex(
                    (find) =>
                      find.providerId ===
                      quotationItemSelected.quotationItem.quotation.provider.ID,
                  );

                  if (findProviderItem === -1) {
                    allItemQuotation.push({
                      providerId:
                        quotationItemSelected.quotationItem.quotation.provider
                          .ID,
                      item: [quotationItemSelected.quotationItem],
                    });
                  } else {
                    allItemQuotation[findProviderItem].item.push(
                      quotationItemSelected.quotationItem,
                    );
                  }
                }

                if (hasFinance) {
                  for await (const providerId of allProvider) {
                    const buyPreFinance =
                      await tx.smartnewsystem_compras_pre_financeiro_pagamento.findFirst(
                        {
                          where: {
                            id_fornecedor: providerId,
                            buyPreFinance: {
                              id_compra: buy.id,
                            },
                          },
                        },
                      );

                    const listNumberRequest =
                      await tx.smartnewsystem_compras_numeracao_pedido.findMany(
                        {
                          orderBy: {
                            id: 'desc',
                          },
                          where: {
                            id_cliente: clientId,
                          },
                        },
                      );

                    const lastNumberRequest =
                      listNumberRequest.length > 0
                        ? listNumberRequest[0].numero + 1
                        : 1;

                    //console.log(lastNumberRequest);

                    const request =
                      await tx.smartnewsystem_compras_numeros_fiscais.create({
                        data: {
                          numero: lastNumberRequest,
                          id_compra: buy.id,
                          id_cliente: clientId,
                          id_fornecedor: providerId,
                          log_user: login,
                        },
                      });

                    await tx.smartnewsystem_compras_numeracao_pedido.create({
                      data: {
                        id_cliente: clientId,
                        numero: lastNumberRequest,
                      },
                    });

                    let typeDocument =
                      await tx.smartnewsystem_financeiro_tipo_documento.findFirst(
                        {
                          where: {
                            descricao: 'NOTA ELETRÔNICA',
                            id_cliente: clientId,
                          },
                        },
                      );

                    if (!typeDocument) {
                      typeDocument =
                        await tx.smartnewsystem_financeiro_tipo_documento.create(
                          {
                            data: {
                              descricao: 'NOTA ELETRÔNICA',
                              id_cliente: clientId,
                            },
                          },
                        );
                    }

                    const allQuotationDiscount =
                      await tx.smartnewsystem_compras_cotacao_desconto.findMany(
                        {
                          where: {
                            id_compra: buy.id,
                            id_fornecedor: providerId,
                          },
                        },
                      );

                    const totalDiscount = allQuotationDiscount.reduce(
                      (acc, current) => {
                        if (current.tipo === 'ACRESCIMO') {
                          return (acc += current.valor);
                        } else if (current.tipo === 'DESCONTO') {
                          return (acc -= current.valor);
                        }
                      },
                      0,
                    );

                    const totalGross = buy.quotationSelected.reduce(
                      (acc, current) => {
                        return (acc +=
                          current.quotationItem.quantidade *
                          current.quotationItem.valor);
                      },
                      0,
                    );

                    if (
                      allItemQuotation
                        .filter((value) => value.providerId === providerId)[0]
                        .item.find(
                          (value) => value.item.compositionItem === null,
                        )
                    ) {
                      throw new Error('Composição não encontrada');
                    }

                    await tx.smartnewsystem_financeiro_controle.create({
                      data: {
                        emitente_pagar: providerId,
                        remetente_pagar: buy.branch.ID,
                        finance: {
                          create: {
                            direcao: 'pagar',
                            id_cliente: clientId,
                            documento_numero: lastNumberRequest.toString(),
                            numero_fiscal: lastNumberRequest
                              .toString()
                              .padStart(3, '0'),
                            id_documento_tipo: typeDocument.id,
                            data_emissao: new Date(),
                            data_lancamento: new DateService()
                              .dayjs(new Date())
                              .subtract(3, 'h')
                              .toDate(),
                            emitente: providerId,
                            remetente: buy.branch.ID,
                            id_filial: buy.branch.ID,
                            id_filial_pagador: 0,
                            id_fornecedor: 0,
                            // chave: body.access_key,
                            descricao: buy.observacao,
                            log_user: login,
                            // numero_fiscal: body.document_number.toString(),
                            total_acrescimo: allQuotationDiscount.reduce(
                              (acc, current) => {
                                if (current.tipo === 'ACRESCIMO') {
                                  return (acc += current.valor);
                                } else if (current.tipo === 'DESCONTO') {
                                  return (acc += 0);
                                }
                              },
                              0,
                            ),
                            total_desconto: allQuotationDiscount.reduce(
                              (acc, current) => {
                                if (current.tipo === 'ACRESCIMO') {
                                  return (acc += 0);
                                } else if (current.tipo === 'DESCONTO') {
                                  return (acc += current.valor);
                                }
                              },
                              0,
                            ),
                            total_liquido: totalDiscount + totalGross,
                            documento_valor: totalGross,
                            data_vencimento: buyPreFinance.vencimento,
                            quantidade_parcela:
                              buyPreFinance.quantidade_parcela,
                            parcelar: buyPreFinance.parcelar,
                            frequencia_pagamento: buyPreFinance.frequencia,
                            frequencia_fixa: buyPreFinance.frequencia_fixa,
                            documento_tipo: buyPreFinance.id_pagamento,
                            status: 'AGUARDANDO_PEDIDO',
                            numberFinance: {
                              create: {
                                id_cliente: clientId,
                                numero: lastNumberRequest,
                              },
                            },
                            items: {
                              createMany: {
                                data: allItemQuotation
                                  .filter(
                                    (value) => value.providerId === providerId,
                                  )[0]
                                  .item.map((item) => {
                                    return {
                                      id_material: item.item.material.id,
                                      id_item_centro_custo:
                                        item.item.compositionItem.id,
                                      log_user: login,
                                      vinculo:
                                        item.item.vinculo === 'equipment'
                                          ? 'EQUIPMENT'
                                          : item.item.vinculo === 'os'
                                          ? 'OS'
                                          : item.item.vinculo === 'stock'
                                          ? 'STOCK'
                                          : null,
                                      id_equipamento: item.item.equipment
                                        ? item.item.equipment.ID
                                        : null,
                                      id_os: item.item.serviceOrder
                                        ? item.item.serviceOrder.ID
                                        : null,
                                      preco_unitario: item.valor,
                                      quantidade: item.quantidade,
                                      total: item.quantidade * item.valor,
                                    };
                                  }),
                              },
                            },
                          },
                        },
                      },
                    });

                    const finance =
                      await tx.smartnewsystem_financeiro_descricao_titulos.findFirst(
                        {
                          orderBy: {
                            id: 'desc',
                          },
                          where: {
                            id_cliente: clientId,
                          },
                        },
                      );

                    await tx.smartnewsystem_financeiro_numero_tipo_documento.create(
                      {
                        data: {
                          id_cliente: clientId,
                          id_tipo_documento: typeDocument.id,
                          numero: lastNumberRequest,
                        },
                      },
                    );

                    let dueDate = new DateService().dayjs(
                      buyPreFinance.vencimento,
                    );
                    const totalSplit =
                      totalGross / buyPreFinance.quantidade_parcela;

                    for (
                      let i = 1;
                      i <= buyPreFinance.quantidade_parcela;
                      i++
                    ) {
                      await tx.smartnewsystem_financeiro_titulo_pagamento.create(
                        {
                          data: {
                            id_titulo: finance.id,
                            parcela: i,
                            valor_parcela: totalSplit,
                            valor_a_pagar: totalSplit,
                            vencimento: dueDate.toDate(),
                            prorrogacao: dueDate.toDate(),
                            status: 1,
                          },
                        },
                      );

                      dueDate = buyPreFinance.frequencia_fixa
                        ? dueDate.add(1, 'month').set('day', dueDate.get('D'))
                        : dueDate.add(buyPreFinance.frequencia, 'days');
                    }

                    await tx.smartnewsystem_compras_pedido_fornecedor.create({
                      data: {
                        id_pedido: request.id,
                        id_finance: finance.id,
                        id_fornecedor: providerId,
                      },
                    });

                    let statusRequest =
                      await tx.smartnewsystem_compras_pedido_status.findMany({
                        where: {
                          id_cliente: clientId,
                        },
                      });

                    if (statusRequest.length === 0) {
                      await tx.smartnewsystem_compras_pedido_status.create({
                        data: {
                          id_cliente: clientId,
                          status: 'FATURADO',
                          icone: 'package',
                          finaliza: 0,
                        },
                      });

                      statusRequest =
                        await tx.smartnewsystem_compras_pedido_status.findMany({
                          where: {
                            id_cliente: clientId,
                          },
                        });
                    }

                    for await (const quotation of allItemQuotation.filter(
                      (value) => value.providerId === providerId,
                    )) {
                      for await (const item of quotation.item) {
                        await tx.smartnewsystem_compras_pedidos_item.create({
                          data: {
                            id_item: item.id,
                            id_pedido: request.id,
                            id_status: statusRequest[0].id,
                            log_user: login,
                          },
                        });
                      }
                    }
                  }

                  const allItemsPresent = buy.item.every((item) =>
                    buy.quotationSelected.some(
                      (sel) => sel.quotationItem.item.id === item.id,
                    ),
                  );

                  if (allItemsPresent) {
                    await tx.smartnewsystem_compras_solicitacao.update({
                      data: {
                        status: 6,
                        responsavel_fechamento: login,
                      },
                      where: {
                        id: buy.id,
                      },
                    });
                  } else {
                    await tx.smartnewsystem_compras_solicitacao.update({
                      data: {
                        status: 7,
                        responsavel_fechamento: login,
                      },
                      where: {
                        id: buy.id,
                      },
                    });
                  }
                } else {
                  for await (const providerId of allProvider) {
                    const listNumberRequest =
                      await tx.smartnewsystem_compras_numeracao_pedido.findMany(
                        {
                          orderBy: {
                            id: 'desc',
                          },
                          where: {
                            id_cliente: clientId,
                          },
                        },
                      );

                    const lastNumberRequest =
                      listNumberRequest.length > 0
                        ? listNumberRequest[0].numero + 1
                        : 1;

                    const request =
                      await tx.smartnewsystem_compras_numeros_fiscais.create({
                        data: {
                          numero: lastNumberRequest,
                          id_compra: buy.id,
                          id_cliente: clientId,
                          id_fornecedor: providerId,
                          log_user: login,
                        },
                      });

                    await tx.smartnewsystem_compras_numeracao_pedido.create({
                      data: {
                        id_cliente: clientId,
                        numero: lastNumberRequest,
                      },
                    });

                    let statusRequest =
                      await tx.smartnewsystem_compras_pedido_status.findMany({
                        where: {
                          id_cliente: clientId,
                        },
                      });

                    if (statusRequest.length === 0) {
                      await tx.smartnewsystem_compras_pedido_status.create({
                        data: {
                          id_cliente: clientId,
                          status: 'FATURADO',
                          icone: 'package',
                          finaliza: 0,
                        },
                      });

                      statusRequest =
                        await tx.smartnewsystem_compras_pedido_status.findMany({
                          where: {
                            id_cliente: clientId,
                          },
                        });
                    }

                    for await (const quotation of allItemQuotation) {
                      for await (const item of quotation.item) {
                        await tx.smartnewsystem_compras_pedidos_item.create({
                          data: {
                            id_item: item.id,
                            id_pedido: request.id,
                            id_status: statusRequest[0].id,
                            log_user: login,
                          },
                        });
                      }
                    }
                  }

                  const allItemsPresent = buy.item.every((item) =>
                    buy.quotationSelected.some(
                      (sel) => sel.quotationItem.item.id === item.id,
                    ),
                  );

                  if (allItemsPresent) {
                    await tx.smartnewsystem_compras_solicitacao.update({
                      data: {
                        status: 6,
                        responsavel_fechamento: login,
                      },
                      where: {
                        id: buy.id,
                      },
                    });
                  } else {
                    await tx.smartnewsystem_compras_solicitacao.update({
                      data: {
                        status: 7,
                        responsavel_fechamento: login,
                      },
                      where: {
                        id: buy.id,
                      },
                    });
                  }
                }
              }
            }
          } else {
            for await (const buy of allBuy) {
              await tx.smartnewsystem_compras_solicitacao.update({
                data: {
                  status: 9,
                },
                where: {
                  id: buy.id,
                },
              });

              await tx.smartnewsystem_compras_aprovacao.updateMany({
                data: {
                  aprovado: 0,
                },
                where: {
                  id_compra: buy.id,
                },
              });

              await tx.smartnewsystem_compras_aprovacao.updateMany({
                data: {
                  aprovado: 0,
                },
                where: {
                  id_compra: buy.id,
                },
              });

              await tx.smartnewsystem_compras_cotacao_selecionada.updateMany({
                data: {
                  aprovado: null,
                },
                where: {
                  id_compra: buy.id,
                },
              });
            }
          }

          response = {
            error: false,
            success: true,
            message: 'Solicitações atualizadas com sucesso!',
          };
        },
        {
          timeout: 60000 * 5,
        },
      )
      .catch((error) => {
        console.log(error);

        response = {
          error: true,
          success: false,
          message: 'Erro interno : ' + error.message,
        };
      });

    return {
      ...response,
    };
  }

  async updateMany(
    id: number[],
    data: Prisma.smartnewsystem_compras_aprovacaoUncheckedUpdateInput,
  ): Promise<boolean> {
    const buyApprobation = await this.table.updateMany({
      where: { id: { in: id } },
      data,
    });

    return buyApprobation.count > 0;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }
}
