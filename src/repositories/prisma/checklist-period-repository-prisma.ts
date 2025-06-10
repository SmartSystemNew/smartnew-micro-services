import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_producao_checklist_turno,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import {
  ICheckListPeriod,
  ICheckListPeriodFindById,
  ICheckListPeriodFindByResponsible,
  IChecklistPeriodListByBranchAndAction,
  IFindById,
  IGroupByBranchAndStatusActionNotGroup,
  IListByTaskAndEquipmentNotGroup,
  IListByTaskAndLocationNotGroup,
} from 'src/models/ICheckListPeriod';
import { CheckListPeriodRepository } from '../checklist-period-repository';

@Injectable()
export class CheckListPeriodRepositoryPrisma
  implements CheckListPeriodRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_producao_checklist_turno;

  async findByCheckListItem(
    checkListItemId: number,
  ): Promise<smartnewsystem_producao_checklist_turno | null> {
    const checkListPeriod = await this.table.findFirst({
      where: {
        id_item_checklist: checkListItemId,
      },
    });

    return checkListPeriod;
  }

  async listByBranchAndAction(
    branchId: number[],
  ): Promise<IChecklistPeriodListByBranchAndAction[]> {
    const checkListPeriod = await this.table.findMany({
      select: {
        id: true,
        log_date: true,
        checkListItem: {
          select: {
            checkListTask: {
              select: {
                descricao: true,
              },
            },
          },
        },
        statusAction: {
          select: {
            checkListTask: {
              select: {
                descricao: true,
              },
            },
          },
        },
        checklist: {
          select: {
            id: true,
            equipment: {
              select: {
                equipamento_codigo: true,
                descricao: true,
                branch: {
                  select: {
                    ID: true,
                    filial_numero: true,
                  },
                },
              },
            },
            location: {
              select: {
                id: true,
                tag: true,
                localizacao: true,
              },
            },
          },
        },
      },
      where: {
        checklist: {
          equipment: {
            ID_filial: {
              in: branchId,
            },
          },
        },
        status_item_nc: {
          gt: 0,
        },
      },
    });

    return checkListPeriod;
  }

  async listByBranchAndStatusAction(
    branchId: number[],
    index: number,
    perPage: number,
  ): Promise<IChecklistPeriodListByBranchAndAction[]> {
    const checkListPeriod = await this.table.findMany({
      skip: index * perPage,
      take: perPage,
      select: {
        id: true,
        log_date: true,
        checkListItem: {
          select: {
            checkListTask: {
              select: {
                descricao: true,
              },
            },
          },
        },
        statusAction: {
          select: {
            checkListTask: {
              select: {
                descricao: true,
              },
            },
          },
        },
        checklist: {
          select: {
            id: true,
            equipment: {
              select: {
                equipamento_codigo: true,
                descricao: true,
                branch: {
                  select: {
                    ID: true,
                    filial_numero: true,
                  },
                },
              },
            },
            location: {
              select: {
                id: true,
                tag: true,
                localizacao: true,
              },
            },
          },
        },
      },
      where: {
        checklist: {
          equipment: {
            ID_filial: {
              in: branchId,
            },
          },
        },
        status: {
          acao: true,
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    return checkListPeriod;
  }

  async listByTaskAndEquipmentNotGroup(
    taskId: number,
    equipmentId: number,
  ): Promise<IListByTaskAndEquipmentNotGroup[]> {
    const period = await this.table.findMany({
      select: {
        id: true,
        log_date: true,
        checkListItem: {
          select: {
            checkListTask: {
              select: {
                descricao: true,
              },
            },
          },
        },
        checklist: {
          select: {
            equipment: {
              select: {
                equipamento_codigo: true,
                descricao: true,
                branch: {
                  select: {
                    filial_numero: true,
                  },
                },
              },
            },
            location: {
              select: {
                id: true,
                tag: true,
                localizacao: true,
                branch: {
                  select: {
                    filial_numero: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        checkListItem: {
          id_tarefa: taskId,
        },
        checklist: {
          id_equipamento: equipmentId,
        },
        productionChecklistAction: {
          none: {},
        },
        status: {
          acao: true,
        },
      },
    });

    return period;
  }

  async listByTaskAndLocationNotGroup(
    taskId: number,
    locationId: number,
  ): Promise<IListByTaskAndLocationNotGroup[]> {
    const period = await this.table.findMany({
      select: {
        id: true,
        log_date: true,
        checkListItem: {
          select: {
            checkListTask: {
              select: {
                descricao: true,
              },
            },
          },
        },
        checklist: {
          select: {
            equipment: {
              select: {
                equipamento_codigo: true,
                descricao: true,
                branch: {
                  select: {
                    filial_numero: true,
                  },
                },
              },
            },
            location: {
              select: {
                id: true,
                tag: true,
                localizacao: true,
                branch: {
                  select: {
                    filial_numero: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        checkListItem: {
          id_tarefa: taskId,
        },
        checklist: {
          id_localizacao: locationId,
        },
        productionChecklistAction: {
          none: {},
        },
        status: {
          acao: true,
        },
      },
    });

    return period;
  }

  async groupByBranchAndStatusActionNotGroup(
    login: string,
    clientId: number,
    index: number,
    perPage: number,
  ): Promise<IGroupByBranchAndStatusActionNotGroup[]> {
    const checklistPeriod: IGroupByBranchAndStatusActionNotGroup[] = await this
      .prismaService.$queryRaw`
      select
        spct.id                 as periodId,
        spct.log_date           as startDate,
        spct2.descricao         as task,
        srp.id                  as productionRegisterId,
        cde.equipamento_codigo  as code,
        cde.descricao           as equipment,
        cdf.ID                  as branchId,
        cdf.filial_numero       as branch
      from smartnewsystem_producao_checklist_turno spct
      join smartnewsystem_producao_checklist_itens spci on spci.id = spct.id_item_checklist
      join smartnewsystem_producao_checklist_tarefas spct2 on spct2.id = spci.id_tarefa
      join smartnewsystem_producao_checklist_status spcs on spcs.id = spct.status_item
      join smartnewsystem_checklist srp on srp.id = spct.id_checklist
      join cadastro_de_equipamentos cde on cde.id = srp.id_equipamento
      join cadastro_de_filiais cdf on cdf.id = cde.id_filial
      where cdf.id in (select sfxu.id_filial from sofman_filiais_x_usuarios sfxu where sfxu.id_user = ${login} and sfxu.id_cliente = ${clientId})
      and spcs.acao
      and NOT EXISTS (
        select * from smartnewsystem_producao_checklist_acao spca
        where spca.id_item = spct.id
      )
      group by spct2.id, cde.id,spct.id
      order by spct.id desc
      limit ${perPage} offset ${index}
    `;

    return checklistPeriod;
  }

  async groupByBranchAndStatusActionNotGroupFast(
    branches: number[],
    index: number,
    perPage: number,
    filter:
      | Prisma.smartnewsystem_producao_checklist_turnoWhereInput
      | undefined,
  ): Promise<ICheckListPeriod['groupByBranchAndStatusActionNotGroupFast'][]> {
    const period = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      skip: index * perPage,
      take: perPage,
      select: {
        id: true,
        log_date: true,
        id_checklist: true,
        checkListItem: {
          select: {
            checkListTask: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        checklist: {
          select: {
            equipment: {
              select: {
                ID: true,
                equipamento_codigo: true,
                descricao: true,
                branch: {
                  select: {
                    ID: true,
                    filial_numero: true,
                  },
                },
              },
            },
            location: {
              select: {
                id: true,
                tag: true,
                localizacao: true,
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
        productionChecklistAction: {
          select: {
            id: true,
            descricao: true,
            id_item: true,
            log_date: true,
            responsavel: true,
            data_inicio: true,
            data_fim: true,
            data_fechamento: true,
            id_registro_producao: true,
            descricao_acao: true,
            user: {
              select: {
                login: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        status: {
          acao: true,
        },
        checklist: {
          OR: [
            {
              equipment: {
                branch: {
                  ID: { in: branches },
                },
              },
            },
            {
              location: {
                branch: {
                  ID: { in: branches },
                },
              },
            },
          ],
        },
        id: {
          notIn: await this.prismaService.smartnewsystem_producao_checklist_acao
            .findMany({
              select: {
                id_item: true,
              },
              where: {
                checklist: {
                  OR: [
                    {
                      equipment: {
                        branch: {
                          ID: {
                            in: branches,
                          },
                        },
                      },
                    },
                    {
                      location: {
                        branch: {
                          ID: {
                            in: branches,
                          },
                        },
                      },
                    },
                  ],
                },
              },
            })
            .then((res) => res.map((r) => r.id_item)),
        },
        ...filter,
      },
    });

    return period;
  }

  async groupByBranchAndStatusActionNotGroupFastNoPage(
    branches: number[],
    filter:
      | Prisma.smartnewsystem_producao_checklist_turnoWhereInput
      | undefined,
  ): Promise<
    ICheckListPeriod['groupByBranchAndStatusActionNotGroupFastNoPage'][]
  > {
    const period = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        log_date: true,
        id_checklist: true,
        checkListItem: {
          select: {
            checkListTask: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        checklist: {
          select: {
            location: {
              select: {
                id: true,
                tag: true,
                localizacao: true,
                branch: {
                  select: {
                    ID: true,
                    filial_numero: true,
                  },
                },
              },
            },
            equipment: {
              select: {
                ID: true,
                equipamento_codigo: true,
                descricao: true,
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
        productionChecklistAction: {
          select: {
            id: true,
            descricao: true,
            id_item: true,
            log_date: true,
            responsavel: true,
            data_inicio: true,
            data_fim: true,
            data_fechamento: true,
            id_registro_producao: true,
            descricao_acao: true,
            user: {
              select: {
                login: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        status: {
          acao: true,
        },
        checklist: {
          equipment: {
            branch: {
              ID: { in: branches },
            },
          },
        },
        id: {
          notIn: await this.prismaService.smartnewsystem_producao_checklist_acao
            .findMany({
              select: {
                id_item: true,
              },
              where: {
                checklist: {
                  equipment: {
                    branch: {
                      ID: {
                        in: branches,
                      },
                    },
                  },
                },
              },
            })
            .then((res) => res.map((r) => r.id_item)),
        },
        ...filter,
      },
    });

    return period;
  }

  async countGroupByBranchAndStatusActionNotGroupFast(
    branches: number[],
    filter:
      | Prisma.smartnewsystem_producao_checklist_turnoWhereInput
      | undefined,
  ): Promise<number> {
    const period = await this.table.aggregate({
      _count: {
        id: true,
      },
      where: {
        status: {
          acao: true,
        },
        checklist: {
          equipment: {
            branch: {
              ID: { in: branches },
            },
          },
        },
        id: {
          notIn: await this.prismaService.smartnewsystem_producao_checklist_acao
            .findMany({
              select: {
                id_item: true,
              },
              where: {
                checklist: {
                  equipment: {
                    branch: {
                      ID: {
                        in: branches,
                      },
                    },
                  },
                },
              },
            })
            .then((res) => res.map((r) => r.id_item)),
        },
        ...filter,
      },
    });

    return period._count.id || 0;
  }

  async groupByBranchAndStatusActionNotGroupNoPage(
    login: string,
    clientId: number,
  ): Promise<IGroupByBranchAndStatusActionNotGroup[]> {
    const checklistPeriod: IGroupByBranchAndStatusActionNotGroup[] = await this
      .prismaService.$queryRaw`
      select
        spct.id                 as periodId,
        spct.log_date           as startDate,
        spct2.descricao         as task,
        srp.id                  as productionRegisterId,
        cde.equipamento_codigo  as code,
        cde.descricao           as equipment,
        cdf.ID                  as branchId,
        cdf.filial_numero       as branch
      from smartnewsystem_producao_checklist_turno spct
      join smartnewsystem_producao_checklist_itens spci on spci.id = spct.id_item_checklist
      join smartnewsystem_producao_checklist_tarefas spct2 on spct2.id = spci.id_tarefa
      join smartnewsystem_producao_checklist_status spcs on spcs.id = spct.status_item
      join smartnewsystem_checklist srp on srp.id = spct.id_checklist
      join cadastro_de_equipamentos cde on cde.id = srp.id_equipamento
      join cadastro_de_filiais cdf on cdf.id = cde.id_filial
      where cdf.id in (select sfxu.id_filial from sofman_filiais_x_usuarios sfxu where sfxu.id_user = ${login} and sfxu.id_cliente = ${clientId})
      and spcs.acao
      and NOT EXISTS (
        select * from smartnewsystem_producao_checklist_acao spca
        where spca.id_item = spct.id
      )
      group by spct2.id, cde.id,spct.id
      order by spct.id desc
    `;

    return checklistPeriod;
  }

  async countGroupByBranchAndStatusActionNotGroup(
    login: string,
    clientId: number,
  ): Promise<number> {
    const checklistPeriod: IGroupByBranchAndStatusActionNotGroup[] = await this
      .prismaService.$queryRaw`
      select
        spct.id                 as periodId
      from smartnewsystem_producao_checklist_turno spct
      join smartnewsystem_producao_checklist_itens spci on spci.id = spct.id_item_checklist
      join smartnewsystem_producao_checklist_tarefas spct2 on spct2.id = spci.id_tarefa
      join smartnewsystem_producao_checklist_status spcs on spcs.id = spct.status_item
      join smartnewsystem_registro_producao srp on srp.id = spct.id_registro_producao
      join cadastro_de_equipamentos cde on cde.id = srp.id_equipamento
      join cadastro_de_filiais cdf on cdf.id = cde.id_filial
      where cdf.id in (select sfxu.id_filial from sofman_filiais_x_usuarios sfxu where sfxu.id_user = ${login} and sfxu.id_cliente = ${clientId})
      and spcs.acao
      and NOT EXISTS (
        select * from smartnewsystem_producao_checklist_acao spca
        where spca.id_item = spct.id
      )
      group by spct2.id, cde.id,spct.id
      order by spct.id desc
    `;

    return checklistPeriod.length;
  }

  async listByBranchAndStatusActionNotGroup(
    branchId: number[],
    index: number,
    perPage: number,
  ): Promise<IChecklistPeriodListByBranchAndAction[]> {
    const checkListPeriod = await this.table.findMany({
      skip: index * perPage,
      take: perPage,
      select: {
        id: true,
        log_date: true,
        checkListItem: {
          select: {
            checkListTask: {
              select: {
                descricao: true,
              },
            },
          },
        },
        statusAction: {
          select: {
            checkListTask: {
              select: {
                descricao: true,
              },
            },
          },
        },
        checklist: {
          select: {
            id: true,
            equipment: {
              select: {
                equipamento_codigo: true,
                descricao: true,
                branch: {
                  select: {
                    ID: true,
                    filial_numero: true,
                  },
                },
              },
            },
            location: {
              select: {
                id: true,
                tag: true,
                localizacao: true,
              },
            },
          },
        },
      },
      where: {
        checklist: {
          equipment: {
            ID_filial: {
              in: branchId,
            },
          },
        },
        status: {
          acao: true,
        },
        productionChecklistAction: {
          every: {
            id_grupo: null,
          },
        },
      },

      orderBy: {
        id: 'desc',
      },
    });

    return checkListPeriod;
  }

  async countListByBranchAndStatusAction(branchId: number[]): Promise<number> {
    const checkListPeriod = await this.table.aggregate({
      _count: {
        id: true,
      },
      where: {
        checklist: {
          equipment: {
            ID_filial: {
              in: branchId,
            },
          },
        },
        status: {
          acao: true,
        },
      },
    });

    return checkListPeriod?._count.id || 0;
  }

  async countListByBranchAndStatusActionAndNotGroup(
    branchId: number[],
  ): Promise<number> {
    const checkListPeriod = await this.table.aggregate({
      _count: {
        id: true,
      },
      where: {
        checklist: {
          equipment: {
            ID_filial: {
              in: branchId,
            },
          },
        },
        status: {
          acao: true,
        },
        productionChecklistAction: {
          every: {
            id_grupo: null,
          },
        },
      },
    });

    return checkListPeriod?._count.id || 0;
  }

  async findByCheckList(
    checkListId: number,
  ): Promise<smartnewsystem_producao_checklist_turno | null> {
    const checkListPeriod = await this.table.findFirst({
      where: {
        checkListItem: {
          id_checklist: checkListId,
        },
      },
    });

    return checkListPeriod;
  }

  async findByStatusAction(
    statusAction: number,
  ): Promise<smartnewsystem_producao_checklist_turno | null> {
    const checkListPeriod = await this.table.findFirst({
      where: {
        status_item_nc: statusAction,
      },
    });

    return checkListPeriod;
  }

  async findById(id: number): Promise<IFindById | null> {
    const checklistPeriod = await this.table.findUnique({
      // include: {
      //   productionRegister: {
      //     include: {
      //       equipment: {
      //         include: {
      //           branch: true,
      //         },
      //       },
      //     },
      //   },
      //   checkListItem: {
      //     include: {
      //       checkListTask: true,
      //     },
      //   },
      // },
      select: {
        id_registro_producao: true,
        id_checklist: true,
        id: true,
        log_date: true,
        checklist: {
          select: {
            equipment: {
              select: {
                ID: true,
                equipamento_codigo: true,
                descricao: true,
                branch: {
                  select: {
                    ID: true,
                    filial_numero: true,
                  },
                },
              },
            },
            location: {
              select: {
                id: true,
                tag: true,
                localizacao: true,
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
        checkListItem: {
          select: {
            checkListTask: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });

    return checklistPeriod;
  }

  async findByTask(
    taskId: number,
  ): Promise<smartnewsystem_producao_checklist_turno | null> {
    const checkListPeriod = await this.table.findFirst({
      where: {
        checkListItem: {
          id_tarefa: taskId,
        },
      },
    });

    return checkListPeriod;
  }

  async listByProductionId(
    productionId: number,
  ): Promise<ICheckListPeriodFindById[]> {
    const checkListPeriod = await this.table.findMany({
      select: {
        id: true,
        id_item_checklist: true,
        observacao: true,
        status_item_nc: true,
        checkListItem: {
          select: {
            checkListTask: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        status: {
          select: {
            id: true,
            descricao: true,
            cor: true,
            icone: true,
            acao: true,
          },
        },
        statusAction: {
          select: {
            id: true,
            descricao: true,
          },
        },
      },
      where: {
        id_registro_producao: productionId,
      },
    });

    return checkListPeriod;
  }

  async listByChecklistId(
    checklistId: number,
  ): Promise<ICheckListPeriodFindById[]> {
    const checkListPeriod = await this.table.findMany({
      select: {
        id: true,
        id_item_checklist: true,
        observacao: true,
        status_item_nc: true,
        checkListItem: {
          select: {
            checkListTask: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        status: {
          select: {
            id: true,
            descricao: true,
            cor: true,
            icone: true,
            acao: true,
          },
        },
        statusAction: {
          select: {
            id: true,
            descricao: true,
          },
        },
      },
      where: {
        id_checklist: checklistId,
      },
    });

    return checkListPeriod;
  }

  async create(
    data: Prisma.smartnewsystem_producao_checklist_turnoUncheckedCreateInput,
  ): Promise<smartnewsystem_producao_checklist_turno> {
    const period = await this.table.create({
      data,
    });

    return period;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_producao_checklist_turnoUncheckedUpdateInput,
  ): Promise<smartnewsystem_producao_checklist_turno> {
    const period = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return period;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id,
      },
    });

    return true;
  }

  async listByPeriodId(periodId: number): Promise<ICheckListPeriodFindById> {
    const checkListPeriod = await this.table.findUnique({
      select: {
        id: true,
        id_item_checklist: true,
        observacao: true,
        status_item_nc: true,
        checkListItem: {
          select: {
            checkListTask: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        status: {
          select: {
            id: true,
            descricao: true,
            cor: true,
            icone: true,
            acao: true,
          },
        },
        statusAction: {
          select: {
            id: true,
            descricao: true,
          },
        },
      },
      where: {
        id: Number(periodId),
      },
    });
    return checkListPeriod;
  }

  async findResponsible(
    id: number,
  ): Promise<ICheckListPeriodFindByResponsible> {
    const period = await this.table.findFirst({
      select: {
        checklist: {
          select: {
            login: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return period;
  }
}
