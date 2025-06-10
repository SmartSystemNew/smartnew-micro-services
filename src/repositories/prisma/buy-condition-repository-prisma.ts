import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import IBuyCondition from 'src/models/IBuyCondition';
import BuyConditionRepository from '../buy-condition-repository';
import { Prisma, smartnewsystem_compras_condicoes } from '@prisma/client';

@Injectable()
export default class BuyConditionRepositoryPrisma
  implements BuyConditionRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_condicoes;

  async listByBuyAndProvider(
    buyId: number,
    providerId: number,
  ): Promise<IBuyCondition['listByBuyAndProvider'][]> {
    const condition = await this.table.findMany({
      select: {
        id: true,
        condicao: true,
        editavel: true,
        conditionAnswer: {
          select: {
            id: true,
            resposta: true,
          },
        },
      },
      where: {
        conditionAnswer: {
          every: {
            id_compra: buyId,
            id_fornecedor: providerId,
          },
        },
      },
    });

    return condition;
  }

  async findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<smartnewsystem_compras_condicoes | null> {
    const answer = await this.table.findFirst({
      where: {
        id_cliente: clientId,
        condicao: name,
      },
    });

    return answer;
  }

  async listByBuy(buyId: number): Promise<IBuyCondition['listByBuy'][]> {
    const condition = await this.table.findMany({
      select: {
        id: true,
        condicao: true,
        editavel: true,
        conditionAnswer: {
          select: {
            id: true,
            resposta: true,
          },
        },
      },
      where: {
        conditionAnswer: {
          every: {
            id_compra: buyId,
          },
        },
      },
    });

    return condition;
  }

  async listByClient(
    clientId: number,
  ): Promise<IBuyCondition['listByClient'][]> {
    const condition = await this.table.findMany({
      select: {
        id: true,
        condicao: true,
        editavel: true,
        conditionAnswer: {
          select: {
            id: true,
            resposta: true,
            buy: {
              select: {
                id: true,
                numero: true,
              },
            },
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
        id_cliente: clientId,
      },
    });

    return condition;
  }

  async create(
    data: Prisma.smartnewsystem_compras_condicoesUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_condicoes> {
    const condition = await this.table.create({
      data,
    });

    return condition;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_compras_condicoesUpdateInput,
  ): Promise<smartnewsystem_compras_condicoes> {
    const condition = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return condition;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
