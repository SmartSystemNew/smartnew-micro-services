import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_producao_checklist_acao_grupo,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import IProductionChecklistActionGroupInfoTable, {
  IProductionChecklistActionGroupListGroupByBranches,
  IProductionChecklistActionGroupUpdate,
} from 'src/models/IProductionChecklistActionGroup';
import { ProductionChecklistActionGroupRepository } from '../production-checklist-action-group-repository';

@Injectable()
export class ProductionChecklistActionGroupRepositoryPrisma
  implements ProductionChecklistActionGroupRepository
{
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService.smartnewsystem_producao_checklist_acao_grupo;

  async countItems(
    clientId: number,
    branches: number[],
    filter:
      | Prisma.smartnewsystem_producao_checklist_acao_grupoWhereInput
      | undefined,
  ): Promise<number> {
    const actionGroup = await this.table.aggregate({
      _count: {
        id: true,
      },
      where: {
        id_cliente: clientId,
        productionChecklistActionItems: {
          some: {
            checklist: {
              equipment: {
                ID_filial: {
                  in: branches,
                },
              },
            },
          },
        },
        ...filter,
      },
    });

    return actionGroup._count.id || 0;
  }

  async create(
    data: Prisma.smartnewsystem_producao_checklist_acao_grupoUncheckedCreateInput,
  ): Promise<smartnewsystem_producao_checklist_acao_grupo> {
    const checklistAction = await this.table.create({
      data,
    });

    return checklistAction;
  }

  async findById(
    id: number,
  ): Promise<IProductionChecklistActionGroupInfoTable | null> {
    const checklistActionGroup = await this.table.findFirst({
      select: {
        id: true,
        numero: true,
        titulo: true,
        data_inicio: true,
        data_fim: true,
        data_concluida: true,
        descricao: true,
        descricao_acao: true,
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        productionChecklistActionItems: {
          select: {
            id: true,
            checklistPeriod: {
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
          },
        },
      },
      where: {
        id,
      },
    });

    return checklistActionGroup;
  }

  async infoTable(
    clientId: number,
    branches: number[],
    index: number,
    perPage: number,
    filter:
      | Prisma.smartnewsystem_producao_checklist_acao_grupoWhereInput
      | undefined,
  ): Promise<IProductionChecklistActionGroupInfoTable[]> {
    const actionGroup = await this.table.findMany({
      skip: index,
      take: perPage,
      select: {
        id: true,
        numero: true,
        titulo: true,
        data_inicio: true,
        data_fim: true,
        data_concluida: true,
        descricao: true,
        descricao_acao: true,
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        productionChecklistActionItems: {
          select: {
            id: true,
            checklistPeriod: {
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
          },
        },
      },
      where: {
        id_cliente: clientId,
        productionChecklistActionItems: {
          some: {
            checklist: {
              OR: [
                {
                  equipment: {
                    ID_filial: {
                      in: branches,
                    },
                  },
                },
                {
                  location: {
                    id_filial: {
                      in: branches,
                    },
                  },
                },
              ],
            },
          },
        },
        ...filter,
      },
    });

    return actionGroup;
  }

  async infoTableNoPage(
    clientId: number,
    branches: number[],
    filter:
      | Prisma.smartnewsystem_producao_checklist_acao_grupoWhereInput
      | undefined,
  ): Promise<IProductionChecklistActionGroupInfoTable[]> {
    const actionGroup = await this.table.findMany({
      select: {
        id: true,
        numero: true,
        titulo: true,
        data_inicio: true,
        data_fim: true,
        data_concluida: true,
        descricao: true,
        descricao_acao: true,
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        productionChecklistActionItems: {
          select: {
            id: true,
            checklistPeriod: {
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
          },
        },
      },
      where: {
        id_cliente: clientId,
        productionChecklistActionItems: {
          some: {
            checklist: {
              OR: [
                {
                  equipment: {
                    ID_filial: {
                      in: branches,
                    },
                  },
                },
                {
                  location: {
                    id_filial: {
                      in: branches,
                    },
                  },
                },
              ],
            },
          },
        },
        ...filter,
      },
    });

    return actionGroup;
  }

  async listGroupByBranches(
    clientId: number,
    branches: number[],
  ): Promise<IProductionChecklistActionGroupListGroupByBranches[]> {
    const actionGroup = await this.table.findMany({
      select: {
        id: true,
        titulo: true,
      },
      where: {
        id_cliente: clientId,
        productionChecklistActionItems: {
          some: {
            checklist: {
              OR: [
                {
                  equipment: {
                    ID_filial: {
                      in: branches,
                    },
                  },
                },
                {
                  location: {
                    id_filial: {
                      in: branches,
                    },
                  },
                },
              ],
            },
          },
        },
      },
    });

    return actionGroup;
  }

  async listGroupByBranch(
    clientId: number,
    branchId: number,
  ): Promise<IProductionChecklistActionGroupListGroupByBranches[]> {
    const actionGroup = await this.table.findMany({
      select: {
        id: true,
        titulo: true,
      },
      where: {
        id_cliente: clientId,
        productionChecklistActionItems: {
          some: {
            checklist: {
              OR: [
                {
                  equipment: {
                    ID_filial: branchId,
                  },
                },
                {
                  location: {
                    id_filial: branchId,
                  },
                },
              ],
            },
          },
        },
      },
    });

    return actionGroup;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_producao_checklist_acao_grupoUncheckedUpdateInput,
  ): Promise<IProductionChecklistActionGroupUpdate> {
    const checklistAction = await this.table.update({
      select: {
        id: true,
        numero: true,
        titulo: true,
        data_inicio: true,
        data_fim: true,
        data_concluida: true,
        descricao: true,
        descricao_acao: true,
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        productionChecklistActionItems: {
          select: {
            id: true,
            checklistPeriod: {
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
          },
        },
      },
      data,
      where: {
        id,
      },
    });

    return checklistAction;
  }
}
