import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import IFinanceStatus from 'src/models/IFinanceStatus';
import FinanceStatusRepository from '../finance-status-repository';

@Injectable()
export default class FinanceStatusRepositoryPrisma
  implements FinanceStatusRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_financeiro_status_parcela;

  async list(): Promise<IFinanceStatus['list'][]> {
    const status = await this.table.findMany({
      select: {
        id: true,
        descricao: true,
      },
    });

    return status;
  }
}
