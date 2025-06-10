import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import IFinanceTributes from 'src/models/IFinanceTributes';
import FinanceTributesRepository from '../finance-tributes-repository';

@Injectable()
export default class FinanceTributesRepositoryPrisma
  implements FinanceTributesRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_financeiro_tributacoes;

  async listByClient(
    clientId: number,
  ): Promise<IFinanceTributes['listByClient'][]> {
    const typePayment = await this.table.findMany({
      select: {
        id: true,
        descricao: true,
      },
      where: {
        id_cliente: clientId,
      },
    });

    return typePayment;
  }

  async findById(id: number): Promise<IFinanceTributes['findById']> {
    const typePayment = await this.table.findUnique({
      select: {
        id: true,
        descricao: true,
      },
      where: {
        id,
      },
    });

    return typePayment;
  }
}
