import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_compras_condicoes_respondidas,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import BuyConditionAnswerRepository from '../buy-condition-answer-repository';
import IBuyConditionAnswer from 'src/models/IBuyConditionAnswer';

@Injectable()
export default class BuyConditionAnswerRepositoryPrisma
  implements BuyConditionAnswerRepository
{
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService.smartnewsystem_compras_condicoes_respondidas;

  async findByBuyAndCondition(
    buyId: number,
    conditionId: number,
    providerId: number,
  ): Promise<smartnewsystem_compras_condicoes_respondidas | null> {
    const answer = await this.table.findFirst({
      where: {
        id_compra: buyId,
        id_condicoes: conditionId,
        id_fornecedor: providerId,
      },
    });

    return answer;
  }

  async listByBuy(
    buyId: number,
  ): Promise<smartnewsystem_compras_condicoes_respondidas[]> {
    const answer = await this.table.findMany({
      where: {
        id_compra: buyId,
      },
    });

    return answer;
  }

  async listByBuyAndProvider(
    buyId: number,
    providerId: number,
  ): Promise<IBuyConditionAnswer['listByBuyAndProvider'][]> {
    const answer = await this.table.findMany({
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
            razao_social: true,
          },
        },
        condition: {
          select: {
            id: true,
            condicao: true,
            editavel: true,
          },
        },
      },
      where: {
        id_compra: buyId,
        id_fornecedor: providerId,
      },
    });

    return answer;
  }

  async listByCondition(
    conditionId: number,
  ): Promise<smartnewsystem_compras_condicoes_respondidas[]> {
    const answer = await this.table.findMany({
      where: {
        id_condicoes: conditionId,
      },
    });

    return answer;
  }

  async create(
    data: Prisma.smartnewsystem_compras_condicoes_respondidasUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_condicoes_respondidas> {
    const answer = await this.table.create({
      data,
    });

    return answer;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_compras_condicoes_respondidasUpdateInput,
  ): Promise<smartnewsystem_compras_condicoes_respondidas> {
    const answer = await this.table.update({
      where: { id },
      data,
    });

    return answer;
  }

  async deleteByBuy(buyId: number): Promise<boolean> {
    await this.table.deleteMany({ where: { id_compra: buyId } });

    return true;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.deleteMany({ where: { id } });

    return true;
  }

  async deleteByBuyAndProvider(
    buyId: number,
    providerId: number,
  ): Promise<boolean> {
    await this.table.deleteMany({
      where: { id_compra: buyId, id_fornecedor: providerId },
    });

    return true;
  }
}
