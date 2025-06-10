import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { IFinanceItemBound } from 'src/models/IFinanceItemBound';
import FinanceItemBoundRepository from '../finance-item-bound-repository';

@Injectable()
export default class FinanceItemBoundRepositoryPrisma
  implements FinanceItemBoundRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_financeiro_dados_vinculo;

  async insert(
    data: Prisma.smartnewsystem_financeiro_dados_vinculoUncheckedCreateInput,
  ): Promise<IFinanceItemBound['insert']> {
    const bound = await this.table.create({
      select: {
        id: true,
        equipment: {
          select: {
            equipamento_codigo: true,
            descricao: true,
          },
        },
        order: {
          select: {
            ordem: true,
            descricao_solicitacao: true,
          },
        },
      },
      data,
    });

    return bound;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_financeiro_dados_vinculoUncheckedUpdateInput,
  ): Promise<IFinanceItemBound['update']> {
    const bound = await this.table.update({
      select: {
        id: true,
        equipment: {
          select: {
            equipamento_codigo: true,
            descricao: true,
          },
        },
        order: {
          select: {
            ordem: true,
            descricao_solicitacao: true,
          },
        },
      },
      where: { id },
      data,
    });

    return bound;
  }

  async findById(id: number): Promise<IFinanceItemBound['findById']> {
    const bound = await this.table.findUnique({
      select: {
        id: true,
        equipment: {
          select: {
            equipamento_codigo: true,
            descricao: true,
          },
        },
        order: {
          select: {
            ordem: true,
            descricao_solicitacao: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return bound;
  }

  async findByItem(itemId: number): Promise<IFinanceItemBound['findByItem']> {
    const bound = await this.table.findFirst({
      select: {
        id: true,
        equipment: {
          select: {
            equipamento_codigo: true,
            descricao: true,
          },
        },
        order: {
          select: {
            ordem: true,
            descricao_solicitacao: true,
          },
        },
      },
      where: {
        id_item: itemId,
      },
    });

    return bound;
  }
}
