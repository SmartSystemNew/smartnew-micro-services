import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import IFinanceTaxation from 'src/models/IFinanceTaxation';
import FinanceTaxationRepository from '../financeTaxation-repository';
import { Prisma, smartnewsystem_financeiro_tributacoes } from '@prisma/client';

@Injectable()
export default class FinanceTaxationRepositoryPrisma
  implements FinanceTaxationRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_financeiro_tributacoes;

  async findById(
    id: number,
  ): Promise<smartnewsystem_financeiro_tributacoes | null> {
    const taxation = await this.table.findUnique({
      where: {
        id,
      },
    });

    return taxation;
  }

  async findByClient(
    clientId: number,
  ): Promise<IFinanceTaxation['findByClient'][]> {
    const taxation = await this.table.findMany({
      select: {
        id: true,
        descricao: true,
      },
      where: {
        id_cliente: clientId,
      },
    });

    return taxation;
  }

  async insert(
    data: Prisma.smartnewsystem_financeiro_tributacoesUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_tributacoes> {
    const taxation = await this.table.create({
      data,
    });

    return taxation;
  }
}
