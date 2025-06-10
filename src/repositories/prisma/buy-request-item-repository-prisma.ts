import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import IBuyRequestItem from 'src/models/IBuyRequestItem';
import BuyRequestItemRepository from '../buy-request-item-repository';
import { Prisma, smartnewsystem_compras_pedidos_item } from '@prisma/client';

@Injectable()
export default class BuyRequestItemRepositoryPrisma
  implements BuyRequestItemRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_pedidos_item;

  async listByRequest(
    requestId: number,
  ): Promise<IBuyRequestItem['listBuyRequest'][]> {
    const items = await this.table.findMany({
      select: {
        id: true,
        log_date: true,
        status: {
          select: {
            id: true,
            icone: true,
            status: true,
            finaliza: true,
            cancelado: true,
          },
        },
        quotationItem: {
          select: {
            id: true,
            quantidade: true,
            valor: true,
            item: {
              select: {
                id: true,
                material: {
                  select: {
                    id: true,
                    material: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
      },
      where: {
        id_pedido: requestId,
      },
    });

    return items;
  }

  async findById(id: number): Promise<IBuyRequestItem['findById'] | null> {
    const items = await this.table.findFirst({
      select: {
        id: true,
        log_date: true,
        status: {
          select: {
            id: true,
            icone: true,
            status: true,
            finaliza: true,
            cancelado: true,
          },
        },
        quotationItem: {
          select: {
            id: true,
            quantidade: true,
            valor: true,
            item: {
              select: {
                id: true,
                material: {
                  select: {
                    id: true,
                    material: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return items;
  }

  async findByItemAndStatus(
    itemId: number,
    statusId: number,
  ): Promise<smartnewsystem_compras_pedidos_item | null> {
    const item = await this.table.findFirst({
      where: {
        id_item: itemId,
        id_status: statusId,
      },
    });

    return item;
  }

  async create(
    data: Prisma.smartnewsystem_compras_pedidos_itemUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_pedidos_item> {
    const item = await this.table.create({ data });

    return item;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_compras_pedidos_itemUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_pedidos_item> {
    const item = await this.table.update({ data, where: { id } });

    return item;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }
}
