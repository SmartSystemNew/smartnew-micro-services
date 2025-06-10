import { Injectable } from '@nestjs/common';
import {
  Prisma,
  log_smartnewsystem_financeiro_descricao_titulos,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import LogFinanceRepository from '../log-finance-repository';

@Injectable()
export default class LogFinanceRepositoryPrisma
  implements LogFinanceRepository
{
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService.log_smartnewsystem_financeiro_descricao_titulos;

  async insert(
    data: Prisma.log_smartnewsystem_financeiro_descricao_titulosUncheckedCreateInput,
  ): Promise<log_smartnewsystem_financeiro_descricao_titulos> {
    const log = await this.table.create({
      data,
    });

    return log;
  }
}
