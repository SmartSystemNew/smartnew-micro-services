import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_compras_cotacao_item } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import BuyQuotationItemRepository from '../buy-quotation-item-repository';
import IBuyQuotationItem from 'src/models/IBuyQuotationItem';

@Injectable()
export default class BuyQuotationItemRepositoryPrisma
  implements BuyQuotationItemRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_cotacao_item;

  async findById(id: number): Promise<IBuyQuotationItem['findById'] | null> {
    const item = await this.table.findUnique({
      select: {
        id: true,
        valor: true,
        quantidade: true,
        item: {
          select: {
            id: true,
            vinculo: true,
            quantidade: true,
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
                id: true,
                material: true,
                tipo: true,
              },
            },
            materialSecond: {
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
      where: {
        id,
      },
    });

    return item;
  }

  async listByBuyAndSelect(
    buyId: number,
  ): Promise<IBuyQuotationItem['listByBuyAndSelect'][]> {
    const items = await this.table.findMany({
      select: {
        id: true,
        valor: true,
        quantidade: true,
        item: {
          select: {
            id: true,
            compositionItem: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      where: {
        item: {
          id_solicitacao: buyId,
          estoque: {
            not: 1,
          },
        },
        quotationSelected: {
          some: {
            id_compra: buyId,
          },
        },
      },
    });

    return items;
  }

  async create(
    data: Prisma.smartnewsystem_compras_cotacao_itemUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_cotacao_item> {
    const item = await this.table.create({ data });

    return item;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_compras_cotacao_itemUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_cotacao_item> {
    const item = await this.table.update({ where: { id }, data });

    return item;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }
}
