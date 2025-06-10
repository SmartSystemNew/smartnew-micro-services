import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ISmartChecklist } from 'src/models/ISmartChecklist';
import SmartChecklistRepository from '../smart-checklist-repository';
import { Prisma, smartnewsystem_checklist } from '@prisma/client';

@Injectable()
export default class SmartChecklistRepositoryPrisma
  implements SmartChecklistRepository
{
  constructor(private prismaService: PrismaService) {}
  private table = this.prismaService.smartnewsystem_checklist;

  async listByClient(
    clientId: number,
    index: number,
    perPage: number,
    // filterText: string,
    // dateFrom: string,
    // dateTo: string,
    filter?: ISmartChecklist['IWhere'],
  ): Promise<ISmartChecklist['listByClient'][]> {
    const checklist = await this.table.findMany({
      skip: Number(index) * Number(perPage),
      take: Number(perPage),
      select: {
        id: true,
        data_hora_inicio: true,
        data_hora_encerramento: true,
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
          },
        },
        location: {
          select: {
            id: true,
            tag: true,
            localizacao: true,
          },
        },
        status: true,
        period: {
          select: {
            turno: true,
          },
        },
        checklistXModel: {
          select: {
            model: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            login: true,
          },
        },
      },
      // where: {
      //   equipment: {
      //     ID_cliente: clientId,
      //   },
      // },
      where: {
        id_cliente: clientId,
        ...filter,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return checklist;
  }

  async listAllByClient(
    clientId: number,
    // filterText: string,
    // dateFrom: string,
    // dateTo: string,
    where: ISmartChecklist['IWhere'],
  ): Promise<ISmartChecklist['listAllByClient'][]> {
    const checklist = await this.table.findMany({
      select: {
        id: true,
        data_hora_inicio: true,
        data_hora_encerramento: true,
        checklistXModel: {
          select: {
            model: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
          },
        },
        location: {
          select: {
            id: true,
            tag: true,
            localizacao: true,
          },
        },
        status: true,
        period: {
          select: {
            turno: true,
          },
        },
        user: {
          select: {
            name: true,
            login: true,
          },
        },
      },
      // where: {
      //   AND: [
      //     {
      //       equipment: {
      //         ID_cliente: clientId,
      //       },
      //     },
      //     {
      //       OR: [
      //         {
      //           equipment: {
      //             OR: [
      //               {
      //                 descricao: {
      //                   contains: filterText,
      //                 },
      //               },
      //               {
      //                 equipamento_codigo: {
      //                   contains: filterText,
      //                 },
      //               },
      //             ],
      //           },
      //         },
      //         {
      //           user: {
      //             OR: [
      //               {
      //                 name: {
      //                   contains: filterText,
      //                 },
      //               },
      //               {
      //                 login: {
      //                   contains: filterText,
      //                 },
      //               },
      //             ],
      //           },
      //         },
      //         {
      //           period: {
      //             turno: {
      //               contains: filterText,
      //             },
      //           },
      //         },
      //         {
      //           id: {
      //             equals: Number(filterText) || -1,
      //           },
      //         },
      //       ],
      //     },
      //     {
      //       AND: [
      //         {
      //           OR: [
      //             {
      //               data_hora_encerramento: {
      //                 lte: dateTo ? new Date(dateTo) : new Date(),
      //               },
      //             },
      //             {
      //               data_hora_encerramento: {
      //                 equals: null,
      //               },
      //             },
      //           ],
      //         },
      //         {
      //           data_hora_inicio: {
      //             gte: dateFrom ? new Date(dateFrom) : new Date('1970-01-01'),
      //             lte: dateTo ? new Date(dateTo) : new Date(),
      //           },
      //         },
      //       ],
      //     },
      //   ],
      // },
      where: {
        id_cliente: clientId,
        ...where,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return checklist;
  }

  async countListByClient(
    clientId: number,
    // filterText: string,
    // dateFrom: string,
    // dateTo: string,
    where: ISmartChecklist['IWhere'],
  ): Promise<number> {
    const checklist = await this.table.count({
      // where: {
      //   AND: [
      //     {
      //       equipment: {
      //         ID_cliente: clientId,
      //       },
      //     },
      //     {
      //       OR: [
      //         {
      //           equipment: {
      //             OR: [
      //               {
      //                 descricao: {
      //                   contains: filterText,
      //                 },
      //               },
      //               {
      //                 equipamento_codigo: {
      //                   contains: filterText,
      //                 },
      //               },
      //             ],
      //           },
      //         },
      //         {
      //           user: {
      //             OR: [
      //               {
      //                 name: {
      //                   contains: filterText,
      //                 },
      //               },
      //               {
      //                 login: {
      //                   contains: filterText,
      //                 },
      //               },
      //             ],
      //           },
      //         },
      //         {
      //           period: {
      //             turno: {
      //               contains: filterText,
      //             },
      //           },
      //         },
      //         {
      //           id: {
      //             equals: Number(filterText) || -1,
      //           },
      //         },
      //       ],
      //     },
      //     {
      //       AND: [
      //         {
      //           OR: [
      //             {
      //               data_hora_encerramento: {
      //                 lte: dateTo ? new Date(dateTo) : new Date(),
      //               },
      //             },
      //             {
      //               data_hora_encerramento: {
      //                 equals: null,
      //               },
      //             },
      //           ],
      //         },
      //         {
      //           data_hora_inicio: {
      //             gte: dateFrom ? new Date(dateFrom) : new Date('1970-01-01'),
      //             lte: dateTo ? new Date(dateTo) : new Date(),
      //           },
      //         },
      //       ],
      //     },
      //   ],
      // },
      where,
      orderBy: {
        id: 'desc',
      },
    });

    return checklist;
  }

  async findById(id: number): Promise<ISmartChecklist['findById'] | null> {
    const checklist = await this.table.findUnique({
      select: {
        id: true,
        data_hora_inicio: true,
        status: true,
        data_hora_encerramento: true,
        checkListPeriod: {
          select: {
            id: true,
            observacao: true,
            status: {
              select: {
                id: true,
                descricao: true,
              },
            },
            statusAction: {
              select: {
                id: true,
                descricao: true,
              },
            },
            checkListItem: {
              select: {
                id: true,
                checkListTask: {
                  select: {
                    id: true,
                    descricao: true,
                    checkListStatusAction: {
                      select: {
                        id: true,
                        descricao: true,
                        checkListControl: {
                          select: {
                            id: true,
                            descricao: true,
                          },
                        },
                        checkListStatus: {
                          select: {
                            id: true,
                            descricao: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            productionChecklistAction: {
              select: {
                id: true,
              },
            },
          },
        },
        checklistXModel: {
          select: {
            model: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        checklistActionGroup: {
          select: {
            id: true,
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
          },
        },
        location: {
          select: {
            id: true,
            tag: true,
            localizacao: true,
          },
        },
        period: {
          select: {
            turno: true,
          },
        },
        user: {
          select: {
            name: true,
            login: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return checklist;
  }

  async findByServiceOrderId(
    serviceOrderId: number,
  ): Promise<ISmartChecklist['findByServiceOrderId'][]> {
    const checklist = await this.table.findMany({
      select: {
        id: true,
        data_hora_inicio: true,
        status: true,
        data_hora_encerramento: true,
        checkListPeriod: {
          select: {
            id: true,
            productionChecklistAction: {
              select: {
                id: true,
              },
            },
          },
        },
        checklistXModel: {
          select: {
            model: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
          },
        },
        location: {
          select: {
            id: true,
            tag: true,
            localizacao: true,
          },
        },
        period: {
          select: {
            turno: true,
          },
        },
        user: {
          select: {
            name: true,
            login: true,
          },
        },
      },
      where: {
        id_ordem_servico: serviceOrderId,
      },
    });

    return checklist;
  }

  async deleteInTransaction(id: number): Promise<boolean> {
    await this.prismaService.$transaction(async (prisma) => {
      await prisma.smartnewsystem_producao_checklist_turno.deleteMany({
        where: {
          id_checklist: id,
        },
      });

      await prisma.smartnewsystem_checklist.delete({
        where: {
          id,
        },
      });
    });

    return true;
  }

  async create(
    data: Prisma.smartnewsystem_checklistUncheckedCreateInput,
  ): Promise<smartnewsystem_checklist> {
    const checklist = await this.table.create({ data });

    return checklist;
  }

  async createTransaction(
    clientId: number,
    login: string,
    equipment: { id: number; branchId: number } | null,
    location: { id: number; branchId: number } | null,
    serviceOrderId: number,
    periodId: number | null,
    modelId: number,
    hourMeter: number | null,
    odometer: number | null,
    kilometer: number | null,
  ): Promise<{
    errorMessage: string;
    created: boolean;
    id: number | null;
  }> {
    return await this.prismaService
      .$transaction(
        async (tx) => {
          const model = await tx.smartnewsystem_producao_checklist.findFirst({
            select: {
              id: true,
              checkListItens: {
                select: {
                  id: true,
                },
              },
            },
            where: {
              id: modelId,
            },
          });

          const checklist = await tx.smartnewsystem_checklist.create({
            data: {
              id_cliente: clientId,
              login: login,
              data_hora_inicio: new Date(),
              id_equipamento: equipment ? equipment.id : null,
              id_localizacao: location ? location.id : null,
              id_ordem_servico: serviceOrderId,
              id_turno: periodId,
              status: 0,
              horimetro: hourMeter,
              odometro: odometer,
              quilometragem: kilometer,
              checklistXModel: {
                create: {
                  id_modelo: model.id,
                },
              },
            },
          });

          for await (const item of model.checkListItens) {
            await tx.smartnewsystem_producao_checklist_turno.create({
              data: {
                id_checklist: checklist.id,
                id_item_checklist: item.id,
                id_filial:
                  equipment !== null ? equipment.branchId : location.branchId,
              },
            });
          }

          return {
            errorMessage: '',
            created: true,
            id: checklist.id,
          };
        },
        {
          timeout: 60000 * 5, // 1 minute
        },
      )
      .catch((error) => {
        console.error(error);

        return {
          errorMessage: error.message,
          created: false,
          id: null,
        };
      });

    // return {
    //   errorMessage: 'Erro ao salvar a checklist.',
    //   created: false,
    // };
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_checklistUncheckedUpdateInput,
  ): Promise<smartnewsystem_checklist> {
    const checklist = await this.table.update({
      where: { id },
      data,
    });

    return checklist;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }

  async listByDescriptionMaintenance(
    descriptionMaintenanceId: number,
  ): Promise<ISmartChecklist['listByDescriptionMaintenance'][]> {
    const checklist = await this.table.findMany({
      select: {
        id: true,
        data_hora_inicio: true,
        data_hora_encerramento: true,
        checklistXModel: {
          select: {
            id: true,
            model: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        serviceOrder: {
          select: {
            ID: true,
            ordem: true,
            equipment: {
              select: {
                ID: true,
                equipamento_codigo: true,
                descricao: true,
              },
            },
          },
        },
        checkListPeriod: {
          select: {
            id: true,
            checkListItem: {
              select: {
                id: true,
                checkListTask: {
                  select: {
                    id: true,
                    descricao: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        serviceOrder: {
          descriptionMaintenance: {
            id: descriptionMaintenanceId,
          },
        },
      },
    });

    return checklist;
  }
}
