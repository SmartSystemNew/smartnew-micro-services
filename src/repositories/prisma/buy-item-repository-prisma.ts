import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_compras_item_solicitacao,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import IBuyItem from 'src/models/IBuyItem';
import BuyItemRepository from '../buy-item-repository';

@Injectable()
export default class BuyItemRepositoryPrisma implements BuyItemRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_item_solicitacao;

  async findById(
    id: number,
  ): Promise<smartnewsystem_compras_item_solicitacao | null> {
    const item = await this.table.findUnique({
      where: {
        id,
      },
    });

    return item;
  }

  async findByBuyAndMaterialService(
    buyId: number,
    materialServiceId: number,
  ): Promise<smartnewsystem_compras_item_solicitacao | null> {
    const buy = await this.table.findFirst({
      where: {
        id_solicitacao: buyId,
        id_material_servico: materialServiceId,
      },
    });

    return buy;
  }

  async listByBuy(buyId: number): Promise<IBuyItem['listByBuy'][]> {
    const item = await this.table.findMany({
      select: {
        id: true,
        sequencia: true,
        quantidade: true,
        observacao: true,
        vinculo: true,
        estoque: true,
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
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
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
        material: {
          select: {
            id: true,
            codigo: true,
            material: true,
            unidade: true,
            codigo_auxiliar: true,
            codigo_ncm: true,
            codigo_secundario: true,
            categoryMaterial: {
              select: {
                id: true,
                departmentCategory: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
        materialSecond: {
          select: {
            id: true,
            codigo: true,
            marca: true,
            classificacao: true,
          },
        },
        priority: {
          select: {
            id: true,
            name: true,
            prazo: true,
          },
        },
        quotationItem: {
          select: {
            id: true,
            quantidade: true,
            valor: true,
            observacao: true,
          },
        },
        quoteReason: {
          select: {
            id: true,
            id_fornecedor: true,
            bloquear: true,
          },
        },
        materialStock: {
          select: {
            id: true,
            status: true,
            log_user: true,
            stockWithdrawal: {
              select: {
                id: true,
                responsavel: true,
                status: true,
                log_date: true,
              },
            },
          },
        },
      },
      where: {
        id_solicitacao: buyId,
      },
    });

    return item;
  }

  async listByBuyAndNotStock(
    buyId: number,
  ): Promise<IBuyItem['listByBuyAndNotStock'][]> {
    const item = await this.table.findMany({
      select: {
        id: true,
        sequencia: true,
        quantidade: true,
        observacao: true,
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
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
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
        material: {
          select: {
            id: true,
            codigo: true,
            material: true,
            unidade: true,
            codigo_auxiliar: true,
            codigo_ncm: true,
            codigo_secundario: true,
            categoryMaterial: {
              select: {
                id: true,
                departmentCategory: {
                  select: {
                    id: true,
                  },
                },
              },
            },
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
        priority: {
          select: {
            id: true,
            name: true,
            prazo: true,
          },
        },
        quotationItem: {
          select: {
            id: true,
            quantidade: true,
            valor: true,
            observacao: true,
          },
        },
        quoteReason: {
          select: {
            id: true,
            id_fornecedor: true,
            bloquear: true,
          },
        },
      },
      where: {
        id_solicitacao: buyId,
        OR: [{ estoque: { equals: null } }, { estoque: { equals: 0 } }],
      },
    });

    return item;
  }

  async listByBuyAndStock(
    buyId: number,
  ): Promise<IBuyItem['listByBuyAndStock'][]> {
    const item = await this.table.findMany({
      select: {
        id: true,
        sequencia: true,
        quantidade: true,
        observacao: true,
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
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
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
        material: {
          select: {
            id: true,
            codigo: true,
            material: true,
            unidade: true,
            codigo_auxiliar: true,
            codigo_ncm: true,
            codigo_secundario: true,
            categoryMaterial: {
              select: {
                id: true,
                departmentCategory: {
                  select: {
                    id: true,
                  },
                },
              },
            },
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
        priority: {
          select: {
            id: true,
            name: true,
            prazo: true,
          },
        },
        quotationItem: {
          select: {
            id: true,
            quantidade: true,
            valor: true,
            observacao: true,
          },
        },
        quoteReason: {
          select: {
            id: true,
            id_fornecedor: true,
            bloquear: true,
          },
        },
      },
      where: {
        id_solicitacao: buyId,
        estoque: 1,
        materialStock: {
          some: {
            status: 1,
          },
        },
      },
    });

    return item;
  }

  async create(
    data: Prisma.smartnewsystem_compras_item_solicitacaoUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_item_solicitacao> {
    const item = await this.table.create({
      data,
    });

    return item;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_compras_item_solicitacaoUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_item_solicitacao> {
    const item = await this.table.update({ where: { id }, data });

    return item;
  }

  async delete(id: number): Promise<true> {
    await this.table.delete({ where: { id } });

    return true;
  }
}
