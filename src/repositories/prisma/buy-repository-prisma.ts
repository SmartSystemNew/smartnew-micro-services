import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_compras_solicitacao } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import IBuy from 'src/models/IBuy';
import BuyRepository from '../buy-repository';
import { DateService } from 'src/service/data.service';

@Injectable()
export class BuyRepositoryPrisma implements BuyRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_solicitacao;

  async countListByClientAndFilterRaw(
    clientId: number,
    filter?: string,
  ): Promise<number> {
    // const result = await this.prismaService.$queryRaw<
    //   {
    //     count: number;
    //   }[]
    // >(
    //   Prisma.sql`
    //   SELECT CAST(COUNT( s.id) AS DECIMAL) AS count
    //   FROM smartnewsystem_compras_solicitacao s
    //   JOIN smartnewsystem_compras_status scs ON scs.id = s.status
    //   LEFT JOIN cadastro_de_filiais b ON s.id_filial = b.id
    //   LEFT JOIN sec_users u ON s.log_user = u.login
    //   LEFT JOIN smartnewsystem_compras_item_solicitacao i ON i.id_solicitacao = s.id
    //   LEFT JOIN smartnewsystem_compras_prioridade scp ON i.id_prioridade = scp.id
    //   WHERE s.id_cliente = ${clientId}
    //   ${filter ? Prisma.sql`AND ${Prisma.raw(filter)}` : Prisma.empty}
    //   `,
    // );

    // return result.length > 0 ? Number(result[0]?.count) || 0 : 0;
    const result = await this.prismaService.$queryRaw<
      {
        count: number;
      }[]
    >(
      Prisma.sql`
      SELECT COUNT(DISTINCT s.id) AS count
      FROM smartnewsystem_compras_solicitacao s
      JOIN smartnewsystem_compras_status scs ON scs.id = s.status
      ${
        filter &&
        (filter.includes('b.filial_numero') ||
          filter.includes('u.name') ||
          filter.includes('scp.id'))
          ? Prisma.sql`
            LEFT JOIN cadastro_de_filiais b ON s.id_filial = b.id
            LEFT JOIN sec_users u ON s.log_user = u.login
            LEFT JOIN smartnewsystem_compras_item_solicitacao i ON i.id_solicitacao = s.id
            LEFT JOIN smartnewsystem_compras_prioridade scp ON i.id_prioridade = scp.id
          `
          : Prisma.empty
      }
      WHERE s.id_cliente = ${clientId}
      ${filter ? Prisma.sql`AND ${Prisma.raw(filter)}` : Prisma.empty}
    `,
    );

    return result.length > 0 ? Number(result[0]?.count) || 0 : 0;
  }

  // async listByClientAndFilterRaw(
  //   clientId: number,
  //   index: number | null,
  //   perPage: number | null,
  //   filter?: string,
  // ): Promise<IBuy['listByClientAndFilterRaw'][]> {
  //   const offset = index !== null && perPage !== null ? index * perPage : null;

  //   // SQL para trazer os dados com soma e paginação
  //   const result = await this.prismaService.$queryRaw<
  //     {
  //       id: number;
  //       numero: number;
  //       observacao: string;
  //       log_date: Date;
  //       branch_name: string;
  //       branch_id: number;
  //       status_id: number;
  //       status_name: string;
  //       user_login: string;
  //       user_name: string;
  //       log_buy_date: Date | null;
  //       priority_id: number | null;
  //       priority_name: string | null;
  //       total_quantity: number | null;
  //       total: number | null;
  //     }[]
  //   >(
  //     Prisma.sql`SELECT
  //     s.id,
  //     s.numero,
  //     s.observacao,
  //     s.log_date,
  //     b.ID AS branch_id,
  //     b.filial_numero AS branch_name,
  //     scs.id AS status_id,
  //     scs.descricao AS status_name,
  //     u.login AS user_login,
  //     u.name AS user_name,
  //     (SELECT log_date
  //      FROM _log_smartnewsystem_compras_solicitacao lscs
  //      WHERE lscs.id_compra = s.id
  //      ORDER BY lscs.log_date DESC
  //      LIMIT 1) AS log_buy_date,
  //     /* scp.id AS priority_id,
  //     scp.name AS priority_name, */
  //     COALESCE((
  //         SELECT COUNT(scis.id)
  //         FROM smartnewsystem_compras_item_solicitacao scis
  //         LEFT JOIN smartnewsystem_compras_cotacao_item qi ON qi.id_item = scis.id
  //         JOIN smartnewsystem_compras_cotacao_selecionada qs ON qs.id_item_cotacao = qi.id
  //         WHERE scis.id_solicitacao = s.id
  //     ), 0) AS total_quantity,
  //     COALESCE((
  //         SELECT SUM(qi.quantidade * qi.valor)
  //         FROM smartnewsystem_compras_item_solicitacao scis
  //         LEFT JOIN smartnewsystem_compras_cotacao_item qi ON qi.id_item = scis.id
  //         JOIN smartnewsystem_compras_cotacao_selecionada qs ON qs.id_item_cotacao = qi.id
  //         WHERE scis.id_solicitacao = s.id
  //     ), 0) AS total
  // FROM smartnewsystem_compras_solicitacao s
  // JOIN smartnewsystem_compras_status scs ON scs.id = s.status
  // LEFT JOIN cadastro_de_filiais b ON s.id_filial = b.id
  // LEFT JOIN sec_users u ON s.log_user = u.login
  // LEFT JOIN smartnewsystem_compras_item_solicitacao i ON i.id_solicitacao = s.id
  // LEFT JOIN smartnewsystem_compras_cotacao_item qi ON qi.id_item = i.id
  // LEFT JOIN smartnewsystem_compras_cotacao_selecionada qs ON qs.id_item_cotacao = qi.id
  // LEFT JOIN smartnewsystem_compras_prioridade scp ON i.id_prioridade = scp.id
  // WHERE s.id_cliente = ${clientId}
  // ${filter ? Prisma.sql`AND ${Prisma.raw(filter)}` : Prisma.empty}
  // GROUP BY
  //     s.id
  //     /* s.numero, s.observacao, s.log_date,
  //     b.ID, b.filial_numero,
  //     scs.id, scs.descricao,
  //     u.login, u.name */
  // ORDER BY s.id DESC
  // ${
  //   offset !== null && perPage !== null
  //     ? Prisma.raw(`LIMIT ${perPage} OFFSET ${offset}`)
  //     : Prisma.empty
  // }
  //     `,
  //   );

  //   // Mapeia os resultados para o formato esperado

  //   const mappedResult = result.map((row) => {
  //     return {
  //       id: row.id,
  //       numero: row.numero.toString().padStart(6, '0'),
  //       observacao: row.observacao,
  //       log_date: row.log_date,
  //       quantity_itens: Number(row.total_quantity) || 0,
  //       total: Number(row.total) || 0,
  //       // quantity_itens: Number(row.total_quantity),
  //       // total: Number(row.total),
  //       branch: {
  //         ID: row.branch_id,
  //         filial_numero: row.branch_name,
  //       },
  //       buyStatus: {
  //         id: row.status_id,
  //         descricao: row.status_name,
  //       },
  //       user: {
  //         login: row.user_login,
  //         name: row.user_name,
  //       },
  //       priority: {
  //         id: row.priority_id,
  //         name: row.priority_name,
  //       },
  //       logBuy: [
  //         {
  //           log_date: row.log_buy_date,
  //         },
  //       ],
  //     };
  //   });

  //   return mappedResult;
  // }

  async listByClientAndFilterRaw(
    clientId: number,
    index: number | null,
    perPage: number | null,
    filter?: string,
  ): Promise<IBuy['listByClientAndFilterRaw'][]> {
    const offset = index !== null && perPage !== null ? index * perPage : null;

    const result = await this.prismaService.$queryRaw<
      {
        id: number;
        numero: number;
        observacao: string;
        log_date: Date;
        branch_id: number;
        branch_name: string;
        status_id: number;
        status_name: string;
        user_login: string;
        user_name: string;
        log_buy_date: Date | null;
        priority_id: number | null;
        priority_name: string | null;
        total_quantity: number | null;
        total: number | null;
      }[]
    >(
      Prisma.sql`
      SELECT
        s.id,
        s.numero,
        s.observacao,
        s.log_date,
        b.ID AS branch_id,
        b.filial_numero AS branch_name,
        scs.id AS status_id,
        scs.descricao AS status_name,
        u.login AS user_login,
        u.name AS user_name,
        lscs.log_date AS log_buy_date,
        scp.id AS priority_id,
        scp.name AS priority_name,
        COALESCE(tq.total_quantity, 0) AS total_quantity,
        COALESCE(t.total, 0) AS total
      FROM smartnewsystem_compras_solicitacao s
      JOIN smartnewsystem_compras_status scs ON scs.id = s.status
      LEFT JOIN cadastro_de_filiais b ON s.id_filial = b.id
      LEFT JOIN sec_users u ON s.log_user = u.login
      LEFT JOIN smartnewsystem_compras_item_solicitacao i ON i.id_solicitacao = s.id
      LEFT JOIN smartnewsystem_compras_prioridade scp ON i.id_prioridade = scp.id
      LEFT JOIN (
        SELECT id_compra, log_date
        FROM _log_smartnewsystem_compras_solicitacao
        WHERE (id_compra, log_date) IN (
          SELECT id_compra, MAX(log_date)
          FROM _log_smartnewsystem_compras_solicitacao
          GROUP BY id_compra
        )
      ) lscs ON lscs.id_compra = s.id
      LEFT JOIN (
        SELECT scis.id_solicitacao, COUNT(scis.id) AS total_quantity
        FROM smartnewsystem_compras_item_solicitacao scis
        LEFT JOIN smartnewsystem_compras_cotacao_item qi ON qi.id_item = scis.id
        JOIN smartnewsystem_compras_cotacao_selecionada qs ON qs.id_item_cotacao = qi.id
        GROUP BY scis.id_solicitacao
      ) tq ON tq.id_solicitacao = s.id
      LEFT JOIN (
        SELECT scis.id_solicitacao, SUM(qi.quantidade * qi.valor) AS total
        FROM smartnewsystem_compras_item_solicitacao scis
        LEFT JOIN smartnewsystem_compras_cotacao_item qi ON qi.id_item = scis.id
        JOIN smartnewsystem_compras_cotacao_selecionada qs ON qs.id_item_cotacao = qi.id
        GROUP BY scis.id_solicitacao
      ) t ON t.id_solicitacao = s.id
      WHERE s.id_cliente = ${clientId}
      ${filter ? Prisma.sql`AND ${Prisma.raw(filter)}` : Prisma.empty}
      GROUP BY s.id
        /*b.ID,
        b.filial_numero,
        scs.id,
        scs.descricao,
        u.login, u.name,
        lscs.log_date,
        scp.id, scp.name,
        tq.total_quantity,
        t.total */
      ORDER BY s.id DESC
      ${
        offset !== null && perPage !== null
          ? Prisma.raw(`LIMIT ${perPage} OFFSET ${offset}`)
          : Prisma.empty
      }
    `,
    );

    const mappedResult = result.map((row) => ({
      id: row.id,
      numero: row.numero.toString().padStart(6, '0'),
      observacao: row.observacao,
      log_date: row.log_date,
      quantity_itens: Number(row.total_quantity) || 0,
      total: Number(row.total) || 0,
      branch: {
        ID: row.branch_id,
        filial_numero: row.branch_name,
      },
      buyStatus: {
        id: row.status_id,
        descricao: row.status_name,
      },
      user: {
        login: row.user_login,
        name: row.user_name,
      },
      priority: {
        id: row.priority_id,
        name: row.priority_name,
      },
      logBuy: [
        {
          log_date: row.log_buy_date,
        },
      ],
    }));

    return mappedResult;
  }

  async listByClientAndFilter(
    clientId: number,
    index?: number | null,
    perPage?: number | null,
    filter?: Prisma.smartnewsystem_compras_solicitacaoWhereInput,
  ): Promise<IBuy['listByClientAndFilter'][]> {
    const buy = await this.table.findMany({
      ...(index !== null &&
        perPage !== null && {
          skip: index * perPage,
          take: perPage,
        }),
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        numero: true,
        observacao: true,
        log_date: true,
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
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        logBuy: {
          take: 1,
          select: {
            id: true,
            log_date: true,
          },
        },
        item: {
          select: {
            id: true,
            quotationItem: {
              select: {
                valor: true,
                quantidade: true,
                quotationSelected: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            id_prioridade: true,
          },
        },
      },
      where: {
        id_cliente: clientId,
        ...filter,
      },
    });

    return buy;
  }

  async listByClientAndFilterGrid(
    clientId: number,
    index?: number | null,
    perPage?: number | null,
    filter?: Prisma.smartnewsystem_compras_solicitacaoWhereInput,
  ): Promise<IBuy['listByClientAndFilterGrid'][]> {
    const buy = await this.table.findMany({
      ...(index !== null &&
        perPage !== null && {
          skip: index * perPage,
          take: perPage,
        }),
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        numero: true,
        observacao: true,
        log_date: true,
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
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        logBuy: {
          select: {
            id: true,
            log_date: true,
          },
        },
      },
      where: {
        id_cliente: clientId,
        ...filter,
      },
    });

    return buy;
  }

  async listByClientAndDateClose(
    clientId: number,
    date: Date,
  ): Promise<smartnewsystem_compras_solicitacao[]> {
    return await this.table.findMany({
      where: {
        id_cliente: clientId,
        fechamento: {
          gte: date,
        },
      },
    });
  }

  async findById(id: number): Promise<IBuy['findById'] | null> {
    const buy = await this.table.findUnique({
      select: {
        id: true,
        numero: true,
        observacao: true,
        status: true,
        log_date: true,
        buyStatus: {
          select: {
            id: true,
            descricao: true,
            icone: true,
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        userResponsible: {
          select: {
            login: true,
            name: true,
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        buyApprobation: {
          select: {
            id: true,
            aprovado: true,
            user: {
              select: {
                login: true,
                name: true,
              },
            },
          },
        },
        item: {
          select: {
            id: true,
            sequencia: true,
            estoque: true,
            quantidade: true,
            vinculo: true,
            priority: {
              select: {
                id: true,
                id_cliente: true,
                name: true,
                prazo: true,
                urgente: true,
                compra_direta: true,
                exige_fornecedor: true,
              },
            },
            material: {
              select: {
                id: true,
              },
            },
            materialSecond: {
              select: {
                id: true,
              },
            },
            quotationItem: {
              select: {
                id: true,
                quantidade: true,
                quotationSelected: {
                  select: {
                    id: true,
                    aprovado: true,
                  },
                },
              },
            },
            compositionItem: {
              select: {
                id: true,
                composicao: true,
                descricao: true,
              },
            },
            equipment: {
              select: {
                ID: true,
              },
            },
            materialOrder: {
              select: {
                id: true,
              },
            },
            serviceOrder: {
              select: {
                ID: true,
              },
            },
          },
        },
        buyQuotationDiscount: {
          select: {
            id: true,
            provider: {
              select: {
                ID: true,
                nome_fantasia: true,
              },
            },
            valor: true,
            motivo: true,
            tipo: true,
          },
        },
        buyRelaunchOwn: {
          select: {
            id: true,
            id_compra: true,
            novo_id_compra: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return buy;
  }

  async createRequest(
    clientId: number,
    buyId: number,
    hasFinance: boolean,
    login: string,
  ): Promise<IBuy['createRequest']> {
    try {
      await this.prismaService
        .$transaction(
          async (tx) => {
            const buy = await tx.smartnewsystem_compras_solicitacao.findFirst({
              select: {
                id: true,
                observacao: true,
                branch: {
                  select: {
                    ID: true,
                  },
                },
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
                id: buyId,
              },
            });

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
                    quotationItemSelected.quotationItem.quotation.provider.ID,
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
                  await tx.smartnewsystem_compras_numeracao_pedido.findMany({
                    orderBy: {
                      id: 'desc',
                    },
                    where: {
                      id_cliente: clientId,
                    },
                  });

                const lastNumberRequest =
                  listNumberRequest.length > 0
                    ? listNumberRequest[0].numero + 1
                    : 1;

                // console.log('last => ', lastNumberRequest);

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
                  await tx.smartnewsystem_financeiro_tipo_documento.findFirst({
                    where: {
                      descricao: 'NOTA ELETRÔNICA',
                      id_cliente: clientId,
                    },
                  });

                if (!typeDocument) {
                  typeDocument =
                    await tx.smartnewsystem_financeiro_tipo_documento.create({
                      data: {
                        descricao: 'NOTA ELETRÔNICA',
                        id_cliente: clientId,
                      },
                    });
                }

                const allQuotationDiscount =
                  await tx.smartnewsystem_compras_cotacao_desconto.findMany({
                    where: {
                      id_compra: buy.id,
                      id_fornecedor: providerId,
                    },
                  });

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
                        quantidade_parcela: buyPreFinance.quantidade_parcela,
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

                let dueDate = new DateService().dayjs(buyPreFinance.vencimento);
                const totalSplit =
                  totalGross / buyPreFinance.quantidade_parcela;

                for (let i = 1; i <= buyPreFinance.quantidade_parcela; i++) {
                  await tx.smartnewsystem_financeiro_titulo_pagamento.create({
                    data: {
                      id_titulo: finance.id,
                      parcela: i,
                      valor_parcela: totalSplit,
                      valor_a_pagar: totalSplit,
                      vencimento: dueDate.toDate(),
                      prorrogacao: dueDate.toDate(),
                      status: 1,
                    },
                  });

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
                  await tx.smartnewsystem_compras_numeracao_pedido.findMany({
                    orderBy: {
                      id: 'desc',
                    },
                    where: {
                      id_cliente: clientId,
                    },
                  });

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

            return {
              error: false,
              success: true,
              message: 'Pedido Criado!',
            };
          },
          {
            timeout: 60000 * 5,
          },
        )
        .catch((error) => {
          console.log(error);

          return {
            error: true,
            success: false,
            message: error.message,
          };
        });
    } catch (error) {
      console.log(error);

      return {
        error: true,
        success: false,
        message: error.message,
      };
    }

    return {
      error: false,
      success: true,
      message: 'Pedido Criado!',
    };
  }

  async findByIdAndProviderQuotation(
    id: number,
    providerId: number,
  ): Promise<IBuy['findByIdAndProviderQuotation'] | null> {
    const buy = await this.table.findUnique({
      select: {
        id: true,
        numero: true,
        observacao: true,
        status: true,
        log_date: true,
        buyStatus: {
          select: {
            id: true,
            descricao: true,
            icone: true,
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        userResponsible: {
          select: {
            login: true,
            name: true,
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        buyApprobation: {
          select: {
            id: true,
            aprovado: true,
            user: {
              select: {
                login: true,
                name: true,
              },
            },
          },
        },
        item: {
          select: {
            id: true,
            quantidade: true,
            sequencia: true,
            observacao: true,
            material: {
              select: {
                id: true,
                codigo: true,
                material: true,
              },
            },
            materialSecond: {
              select: {
                id: true,
                codigo: true,
                classificacao: true,
                marca: true,
              },
            },
            quotationItem: {
              select: {
                id: true,
                valor: true,
                quantidade: true,
                observacao: true,
                quotationSelected: {
                  select: {
                    id: true,
                    aprovado: true,
                  },
                },
              },
              where: {
                quotation: {
                  id_fornecedor: providerId,
                },
              },
            },
          },
        },
        buyQuotationDiscount: {
          select: {
            id: true,
            provider: {
              select: {
                ID: true,
                nome_fantasia: true,
              },
            },
            valor: true,
            motivo: true,
            tipo: true,
            tribute: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
          where: {
            id_fornecedor: providerId,
          },
        },
      },
      where: {
        id,
      },
    });

    return buy;
  }

  async listByBuyAndFinishProvider(
    id: number,
    providerId: number,
  ): Promise<IBuy['listByBuyAndFinishProvider']> {
    const buy = await this.table.findFirst({
      select: {
        id: true,
        numero: true,
        observacao: true,
        status: true,
        log_date: true,
        conditionAnswer: {
          select: {
            id: true,
            resposta: true,
            provider: {
              select: {
                ID: true,
                nome_fantasia: true,
              },
            },
            condition: {
              select: {
                id: true,
                condicao: true,
              },
            },
          },
        },
        buyPreFinance: {
          select: {
            id: true,
            buyPreFinancePayment: {
              select: {
                id: true,
                paymentType: {
                  select: {
                    id: true,
                    descricao: true,
                  },
                },
                vencimento: true,
                quantidade_parcela: true,
                parcelar: true,
                frequencia: true,
                frequencia_fixa: true,
              },
              where: {
                id_fornecedor: providerId,
              },
            },
          },
        },
      },
      where: {
        id,
        buyPreFinance: {
          some: {
            buyPreFinancePayment: {
              some: {
                id_fornecedor: providerId,
              },
            },
          },
        },
      },
    });

    return buy;
  }

  async create(
    data: Prisma.smartnewsystem_compras_solicitacaoUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_solicitacao> {
    const buy = await this.table.create({
      data,
    });

    return buy;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_compras_solicitacaoUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_solicitacao> {
    const buy = await this.table.update({
      where: { id },
      data,
    });

    return buy;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }
}
