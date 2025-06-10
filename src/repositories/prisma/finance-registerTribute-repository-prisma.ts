import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_financeiro_registro_tributo,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { IFinanceRegisterTribute } from 'src/models/IFinanceRegisterTribute';
import FinanceRegisterTributeRepository from '../finance-registerTribute-repository';

@Injectable()
export default class FinanceRegisterTributeRepositoryPrisma
  implements FinanceRegisterTributeRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_financeiro_registro_tributo;

  async findByFinance(
    financeId: number,
  ): Promise<IFinanceRegisterTribute['findByFinance'][]> {
    const register = await this.table.findMany({
      select: {
        id: true,
        descricao: true,
        tipo: true,
        valor: true,
        tribute: {
          select: {
            id: true,
            descricao: true,
          },
        },
      },
      where: {
        id_titulo: financeId,
      },
    });

    return register;
  }

  async sumFinanceAndType(
    financeId: number,
    type: 'ACRESCIMO' | 'DESCONTO',
  ): Promise<number> {
    const register = await this.table.aggregate({
      _sum: {
        valor: true,
      },
      where: {
        id_titulo: financeId,
        tipo: type,
      },
    });

    return register._sum.valor || 0;
  }

  async findById(
    id: number,
  ): Promise<IFinanceRegisterTribute['findById'] | null> {
    const register = await this.table.findUnique({
      select: {
        id: true,
        descricao: true,
        tipo: true,
        valor: true,
        tribute: {
          select: {
            id: true,
            descricao: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return register;
  }

  async create(
    data: Prisma.smartnewsystem_financeiro_registro_tributoUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_registro_tributo> {
    const register = await this.table.create({
      data,
    });

    return register;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_financeiro_registro_tributoUncheckedUpdateInput,
  ): Promise<smartnewsystem_financeiro_registro_tributo> {
    const register = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return register;
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
