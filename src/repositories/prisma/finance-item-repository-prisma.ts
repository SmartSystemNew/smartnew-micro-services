import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  IAggregateByTitle,
  IFindByTitle,
  IListFinanceByCostCenterAndDirection,
} from 'src/models/IFinanceItem';
import { FinanceItemRepository } from '../finance-item-repository';
import {
  Prisma,
  smartnewsystem_financeiro_titulos_dados,
} from '@prisma/client';

@Injectable()
export class FinanceItemRepositoryPrisma implements FinanceItemRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_financeiro_titulos_dados;

  async aggregateByTitle(titleId: number): Promise<IAggregateByTitle> {
    const item = await this.table.aggregate({
      _sum: {
        total: true,
      },
      where: {
        id_titulo: titleId,
      },
    });

    return item;
  }

  async listFinanceByCostCenterAndDirection(
    costCenterId: number[],
    direction: 'pagar' | 'receber',
  ): Promise<IListFinanceByCostCenterAndDirection[]> {
    const item = await this.table.findMany({
      select: {
        finance: {
          select: {
            id: true,
          },
        },
      },
      where: {
        compositionItem: {
          compositionGroup: {
            costCenter: {
              ID: {
                in: costCenterId,
              },
            },
          },
        },
        finance: {
          direcao: direction,
        },
      },
    });

    return item;
  }

  async findByTitle(titleId: number): Promise<IFindByTitle[]> {
    const item = await this.table.findMany({
      select: {
        id: true,
        item: true,
        total: true,
        quantidade: true,
        vinculo: true,
        preco_unitario: true,
        id_equipamento: true,
        id_os: true,
        id_insumo: true,
        id_material: true,
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
            equipment: {
              select: {
                ID: true,
                equipamento_codigo: true,
                descricao: true,
              },
            },
          },
        },
        finance: {
          select: {
            id: true,
            direcao: true,
            numero_fiscal: true,
            financeControl: {
              select: {
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
              },
            },
          },
        },
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
        input: {
          select: {
            id: true,
            insumo: true,
          },
        },
        material: {
          select: {
            id: true,
            material: true,
          },
        },
        financeBound: {
          select: {
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
      where: {
        id_titulo: titleId,
      },
    });

    return item;
  }

  async findByTitleNotDefault(
    titleId: number,
  ): Promise<smartnewsystem_financeiro_titulos_dados[]> {
    const item = await this.table.findMany({
      where: {
        id_titulo: titleId,
      },
    });

    return item;
  }

  async findById(id: number): Promise<IFindByTitle | null> {
    const item = await this.table.findFirst({
      select: {
        id: true,
        item: true,
        total: true,
        quantidade: true,
        preco_unitario: true,
        vinculo: true,
        id_equipamento: true,
        id_os: true,
        id_insumo: true,
        id_material: true,
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
            equipment: {
              select: {
                ID: true,
                equipamento_codigo: true,
                descricao: true,
              },
            },
          },
        },
        finance: {
          select: {
            id: true,
            direcao: true,
            numero_fiscal: true,
            financeControl: {
              select: {
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
              },
            },
          },
        },
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
        input: {
          select: {
            id: true,
            insumo: true,
          },
        },
        material: {
          select: {
            id: true,
            material: true,
          },
        },
        financeBound: {
          select: {
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
      where: {
        id,
      },
    });

    return item;
  }

  async findByTitleByDirection(
    titleId: number,
    direction: 'pagar' | 'receber',
  ): Promise<IFindByTitle[]> {
    const item = await this.table.findMany({
      select: {
        id: true,
        item: true,
        total: true,
        vinculo: true,
        quantidade: true,
        preco_unitario: true,
        id_equipamento: true,
        id_os: true,
        id_insumo: true,
        id_material: true,
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
            equipment: {
              select: {
                ID: true,
                equipamento_codigo: true,
                descricao: true,
              },
            },
          },
        },
        finance: {
          select: {
            id: true,
            direcao: true,
            numero_fiscal: true,
            financeControl: {
              select: {
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
              },
            },
          },
        },
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
        input: {
          select: {
            id: true,
            insumo: true,
          },
        },
        material: {
          select: {
            id: true,
            material: true,
          },
        },
        financeBound: {
          select: {
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
      where: {
        id_titulo: titleId,
        finance: {
          direcao: direction,
        },
      },
    });

    return item;
  }

  async findByTitleByDirectionAnd(
    titleId: number,
    direction: 'pagar' | 'receber',
  ): Promise<IFindByTitle[]> {
    const item = await this.table.findMany({
      select: {
        id: true,
        item: true,
        total: true,
        quantidade: true,
        vinculo: true,
        preco_unitario: true,
        id_equipamento: true,
        id_os: true,
        id_insumo: true,
        id_material: true,
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
            equipment: {
              select: {
                ID: true,
                equipamento_codigo: true,
                descricao: true,
              },
            },
          },
        },
        finance: {
          select: {
            id: true,
            direcao: true,
            numero_fiscal: true,
            financeControl: {
              select: {
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
              },
            },
          },
        },
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
        input: {
          select: {
            id: true,
            insumo: true,
          },
        },
        material: {
          select: {
            id: true,
            material: true,
          },
        },
        financeBound: {
          select: {
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
      where: {
        id_titulo: titleId,
        finance: {
          direcao: direction,
        },
      },
    });

    return item;
  }

  async insert(
    data: Prisma.smartnewsystem_financeiro_titulos_dadosUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_titulos_dados> {
    const item = await this.table.create({
      data,
    });

    return item;
  }

  async countItem(titleId: number): Promise<number> {
    const item = await this.table.aggregate({
      _count: true,
      where: {
        id_titulo: titleId,
      },
    });

    return item._count ?? 0;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_financeiro_titulos_dadosUncheckedUpdateInput,
  ): Promise<smartnewsystem_financeiro_titulos_dados> {
    const item = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return item;
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
