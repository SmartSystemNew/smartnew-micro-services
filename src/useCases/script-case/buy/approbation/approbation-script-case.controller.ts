import { Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import BuyApprobationRepository from 'src/repositories/buy-approbation-repository';
import BuyPreFinancePaymentRepository from 'src/repositories/buy-pre-finance-payment-repository';
import BuyQuotationSelectedRepository from 'src/repositories/buy-quotation-selected-repository';
import ElevationRepository from 'src/repositories/elevation-repository';
import FinanceControlRepository from 'src/repositories/finance-control-repository';
import FinanceNumberRepository from 'src/repositories/finance-number-repository';
import FinanceRepository from 'src/repositories/finance-repository';
import LogFinanceRepository from 'src/repositories/log-finance-repository';
import { z } from 'zod';

@ApiTags('Script Case - Buy - Approbation')
@Controller('/script-case/buy/approbation')
export default class BuyApprobationController {
  constructor(
    private buyApprobationRepository: BuyApprobationRepository,
    private elevationRepository: ElevationRepository,
    private buyQuotationSelected: BuyQuotationSelectedRepository,
    private financeRepository: FinanceRepository,
    private logFinanceRepository: LogFinanceRepository,
    private financeControlRepository: FinanceControlRepository,
    private financeNumberRepository: FinanceNumberRepository,
    private buyPreFinancePaymentRepository: BuyPreFinancePaymentRepository,
  ) {}
  @UseGuards(AuthGuard)
  @Get('/')
  async listByLogin(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      page: z.coerce
        .string()
        .optional()
        .nullable()
        .transform((value) =>
          value === 'null'
            ? null
            : value === undefined || value.length === 0
            ? null
            : Number(value) - 1,
        ),
      perPage: z.coerce
        .string()
        .optional()
        .nullable()
        .transform((value) =>
          value === 'null'
            ? null
            : value === undefined || value.length === 0
            ? null
            : Number(value),
        ),
      globalFilter: z
        .string()
        .transform((value) => (value === '' ? null : value))
        .optional(),
      filterColumn: z
        .string()
        .transform((value) => (value === '' ? null : value))
        .optional(),
      filterText: z.string().optional().default(''),
      approved: z
        .string()
        .transform((value) => (value === '' ? null : value === 'true'))
        .optional(),
      date_from: z
        .string()
        .transform((value) => (value === '' ? null : new Date(value)))
        .optional(),
      date_to: z
        .string()
        .transform((value) => (value === '' ? null : new Date(value)))
        .optional(),
      status: z
        .string()
        .transform((value) =>
          value === '' ? null : value.split(',').map(Number),
        )
        .optional(),
    });

    const elevationUser =
      await this.elevationRepository.findByLoginAndModuleAndBlank(
        user.login,
        user.branches,
        9,
        'blank_aprovacoes_cotacao',
      );

    const query = querySchema.parse(req.query);
    //console.log(query);

    // if (query.globalFilter && query.globalFilter.length > 0) {
    // }

    // if (query.filterColumn && query.filterText) {
    //   switch (query.filterColumn) {
    //     case 'code':
    //       filterText = {
    //         buy: {
    //           numero: {
    //             equals: Number(query.filterText),
    //           },
    //         },
    //       };
    //       break;
    //     case 'company':
    //       filterText = {
    //         buy: {
    //           branch: {
    //             filial_numero: {
    //               contains: query.filterText,
    //             },
    //           },
    //         },
    //       };
    //       break;
    //     case 'status':
    //       filterText = {
    //         buy: {
    //           buyStatus: {
    //             descricao: {
    //               contains: query.filterText,
    //             },
    //           },
    //         },
    //       };
    //       break;
    //     case 'date':
    //       if (query.dateFrom && query.dateTo) {
    //         filterText = {
    //           buy: {
    //             logBuy: {
    //               log_date: {
    //                 gte: query.dateFrom,
    //                 lte: query.dateTo,
    //               },
    //             },
    //           },
    //         };
    //       }
    //       break;
    //     case 'user':
    //       filterText = {
    //         user: {
    //           name: {
    //             contains: query.filterText,
    //           },
    //         },
    //       };
    //       break;
    //     case 'observation':
    //       filterText = {
    //         buy: {
    //           observacao: {
    //             contains: query.filterText,
    //           },
    //         },
    //       };
    //       break;
    //   }
    // }

    const response = [];

    const allApprobation =
      await this.buyApprobationRepository.listByBranchesAndLogin(
        elevationUser.map((value) => value.id_filial),
        user.login,
        'blank_aprovacoes_cotacao',
        query.page,
        query.perPage,
        {
          ...(query.globalFilter &&
            query.globalFilter.length > 0 && {
              AND: {
                OR: [
                  {
                    //code
                    buy: {
                      numero: {
                        equals: Number(query.globalFilter),
                      },
                    },
                  },
                  {
                    //company
                    buy: {
                      branch: {
                        filial_numero: {
                          contains: query.globalFilter,
                        },
                      },
                    },
                  },
                  {
                    //status
                    buy: {
                      buyStatus: {
                        descricao: {
                          contains: query.globalFilter,
                        },
                      },
                    },
                  },
                  {
                    //user
                    user: {
                      name: {
                        contains: query.globalFilter,
                      },
                    },
                  },
                  {
                    //observation
                    buy: {
                      observacao: {
                        contains: query.globalFilter,
                      },
                    },
                  },
                ],
              },
            }),
          ...(query.filterColumn &&
            query.filterColumn.length > 0 &&
            query.filterColumn === 'number' && {
              AND: {
                buy: {
                  numero: {
                    equals: Number(query.filterText),
                  },
                },
              },
            }),
          ...(query.filterColumn &&
            query.filterColumn.length > 0 &&
            query.filterColumn === 'branch' && {
              AND: {
                buy: {
                  branch: {
                    filial_numero: {
                      contains: query.filterText,
                    },
                  },
                },
              },
            }),
          ...(query.filterColumn &&
            query.filterColumn.length > 0 &&
            query.filterColumn === 'status' && {
              AND: {
                buy: {
                  buyStatus: {
                    descricao: {
                      contains: query.filterText,
                    },
                  },
                },
              },
            }),
          ...(query.filterColumn &&
            query.filterColumn.length > 0 &&
            query.filterColumn === 'approved' && {
              AND: {
                aprovado: {
                  equals: query.approved ? 1 : 0,
                },
              },
            }),
          ...(query.filterColumn &&
            query.filterColumn.length > 0 &&
            query.filterColumn === 'logDate' && {
              AND: {
                buy: {
                  logBuy: {
                    some: {
                      log_date: {
                        gte: query.date_from,
                        lte: query.date_to,
                      },
                    },
                  },
                },
              },
            }),
          ...(query.filterColumn &&
            query.filterColumn.length > 0 &&
            query.filterColumn === 'responsable' &&
            query.filterText !== 'ALL' && {
              AND: {
                buy: {
                  userResponsible: {
                    name: {
                      contains: query.filterText,
                    },
                  },
                },
              },
            }),
          ...(query.filterColumn &&
            query.filterColumn.length > 0 &&
            query.filterColumn === 'observation' && {
              AND: {
                buy: {
                  observacao: {
                    contains: query.filterText,
                  },
                },
              },
            }),
        },
        //filterText,
      );
    //

    const countAllApprobation =
      await this.buyApprobationRepository.countListByBranchesAndLogin(
        elevationUser.map((value) => value.id_filial),
        user.login,
        {
          ...(query.globalFilter &&
            query.globalFilter.length > 0 && {
              AND: {
                OR: [
                  {
                    //code
                    buy: {
                      numero: {
                        equals: Number(query.globalFilter),
                      },
                    },
                  },
                  {
                    //company
                    buy: {
                      branch: {
                        filial_numero: {
                          contains: query.globalFilter,
                        },
                      },
                    },
                  },
                  {
                    //status
                    buy: {
                      buyStatus: {
                        descricao: {
                          contains: query.globalFilter,
                        },
                      },
                    },
                  },
                  {
                    //user
                    user: {
                      name: {
                        contains: query.globalFilter,
                      },
                    },
                  },
                  {
                    //observation
                    buy: {
                      observacao: {
                        contains: query.globalFilter,
                      },
                    },
                  },
                ],
              },
            }),
          ...(query.filterColumn &&
            query.filterColumn.length > 0 &&
            query.filterColumn === 'number' && {
              AND: {
                buy: {
                  numero: {
                    equals: Number(query.filterText),
                  },
                },
              },
            }),
          ...(query.filterColumn &&
            query.filterColumn.length > 0 &&
            query.filterColumn === 'branch' && {
              AND: {
                buy: {
                  branch: {
                    filial_numero: {
                      contains: query.filterText,
                    },
                  },
                },
              },
            }),
          ...(query.filterColumn &&
            query.filterColumn.length > 0 &&
            query.filterColumn === 'status' && {
              AND: {
                buy: {
                  buyStatus: {
                    descricao: {
                      contains: query.filterText,
                    },
                  },
                },
              },
            }),
          ...(query.filterColumn &&
            query.filterColumn.length > 0 &&
            query.filterColumn === 'approved' && {
              AND: {
                aprovado: {
                  equals: query.approved ? 1 : 0,
                },
              },
            }),
          ...(query.filterColumn &&
            query.filterColumn.length > 0 &&
            query.filterColumn === 'logDate' && {
              AND: {
                buy: {
                  logBuy: {
                    some: {
                      log_date: {
                        gte: query.date_from,
                        lte: query.date_to,
                      },
                    },
                  },
                },
              },
            }),
          ...(query.filterColumn &&
            query.filterColumn.length > 0 &&
            query.filterColumn === 'responsable' &&
            query.filterText !== 'ALL' && {
              AND: {
                buy: {
                  userResponsible: {
                    name: {
                      contains: query.filterText,
                    },
                  },
                },
              },
            }),
          ...(query.filterColumn &&
            query.filterColumn.length > 0 &&
            query.filterColumn === 'observation' && {
              AND: {
                buy: {
                  observacao: {
                    contains: query.filterText,
                  },
                },
              },
            }),
        },
        //filterText,
      );

    for await (const approbation of allApprobation) {
      const nivelBuy = approbation.user.elevation.find(
        (value) => value.id_filial === approbation.buy.branch.ID,
      );

      const everyoneApproved =
        await this.buyApprobationRepository.everyoneApprovedBeforeMe(
          approbation.buy.branch.ID,
          nivelBuy.nivel,
          'blank_aprovacoes_cotacao',
          user.login,
          approbation.buy.id,
        );

      const validCanEdit = nivelBuy.nivel > 1 ? everyoneApproved : true;

      response.push({
        approved:
          approbation.aprovado === 1
            ? 'approved'
            : approbation.aprovado === 0
            ? 'banned'
            : 'pending',
        canEdit:
          approbation.aprovado === 1 || approbation.aprovado === 0
            ? false
            : validCanEdit,
        branch: approbation.buy.branch.filial_numero,
        id: approbation.id,
        idBuy: approbation.buy.id,
        logDate: approbation.log_date,
        number: approbation.buy.numero.toString().padStart(6, '0'),
        observation: approbation.buy.observacao,
        responsable: approbation.buy?.userResponsible?.name || '',
        status: approbation.buy.buyStatus.descricao,
        total: approbation.buy.quotationSelected.reduce((total, item) => {
          return (
            total + item.quotationItem.quantidade * item.quotationItem.valor
          );
        }, 0),
      });
    }

    // for await (const elevation of elevationUser) {
    //   if (elevation && elevation.nivel === 1) {
    //     const allApprobation =
    //       await this.buyApprobationRepository.listByBranchesLastNivel(
    //         [elevation.id_filial],
    //         user.login,
    //         query.page,
    //         query.perPage,
    //         filterText,
    //       );

    //     response.push(
    //       ...allApprobation.map((approbation) => {
    //         return {
    //           approved:
    //             approbation.aprovado === 1
    //               ? 'approved'
    //               : approbation.aprovado === 0
    //               ? 'banned'
    //               : 'pending',
    //           branch: approbation.buy.branch.filial_numero,
    //           id: approbation.id,
    //           idBuy: approbation.buy.id,
    //           logDate: approbation.buy.fechamento,
    //           number: approbation.buy.numero.toString().padStart(6, '0'),
    //           observation: approbation.buy.observacao,
    //           responsable: approbation.buy.userResponsible.name,
    //           status: approbation.buy.buyStatus.descricao,
    //           total: approbation.buy.quotationSelected.reduce((total, item) => {
    //             return (
    //               total +
    //               item.quotationItem.quantidade * item.quotationItem.valor
    //             );
    //           }, 0),
    //         };
    //       }),
    //     );
    //   } else if (elevation) {
    //     const allApprobation =
    //       await this.buyApprobationRepository.listByBranches(
    //         [elevation.id_filial],
    //         user.login,
    //         'blank_aprovacoes_cotacao',
    //         elevation.id,
    //         query.page,
    //         query.perPage,
    //         filterText,
    //       );

    //     response.push(
    //       ...allApprobation.map((approbation) => {
    //         return {
    //           approved:
    //             approbation.aprovado === 1
    //               ? 'approved'
    //               : approbation.aprovado === 0
    //               ? 'banned'
    //               : 'pending',
    //           branch: approbation.buy.branch.filial_numero,
    //           id: approbation.id,
    //           idBuy: approbation.buy.id,
    //           logDate: approbation.buy.fechamento,
    //           number: approbation.buy.numero.toString().padStart(6, '0'),
    //           observation: approbation.buy.observacao,
    //           responsable: approbation.buy.userResponsible.name,
    //           status: approbation.buy.buyStatus.descricao,
    //           total: approbation.buy.quotationSelected.reduce((total, item) => {
    //             return (
    //               total +
    //               item.quotationItem.quantidade * item.quotationItem.valor
    //             );
    //           }, 0),
    //         };
    //       }),
    //     );
    //   }
    // }

    //response.sort((a, b) => b.id - a.id);

    return {
      data: response,
      totalItens: countAllApprobation,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/update-request')
  async updateRequest(@Req() req) {
    const user: IUserInfo = req.user;

    const bodySchema = z.object({
      approved: z.string().transform((value) => value === 'true'),
      signature: z.string(),
      ids: z.coerce.number().array(),
      justify: z.string(),
    });

    const body = bodySchema.parse(req.body);

    // for await (const approbationId of body.ids) {
    //   const approbation =
    //     await this.buyApprobationRepository.findById(approbationId);

    //   if (!approbation) {
    //     throw new NotFoundException(MessageService.Buy_id_not_found);
    //   }

    //   await this.buyApprobationRepository.update(approbation.id, {
    //     aprovado: body.approved === true ? 1 : 0,
    //     observacao: body.justify,
    //     assinatura: Buffer.from(body.signature),
    //   });

    //   const findBuyIndex = allBuy.findIndex(
    //     (find) => find.id === approbation.buy.id,
    //   );

    //   if (findBuyIndex === -1) {
    //     allBuy.push(approbation.buy);
    //   }
    // }

    try {
      const update = await this.buyApprobationRepository.updateRequest(
        user.clientId,
        user.login,
        body.ids,
        body.approved,
        body.justify,
        body.signature,
        user.module.findIndex((mod) => mod.id === 11) >= 0,
      );

      return {
        ...update,
      };
    } catch (error) {
      console.log(error);
      return {
        error: true,
        message: error,
      };
    }
  }
}
