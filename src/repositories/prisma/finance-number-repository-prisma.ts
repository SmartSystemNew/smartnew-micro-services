import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_financeiro_numero } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import FinanceNumberRepository from '../finance-number-repository';

@Injectable()
export default class FinanceNumberRepositoryPrisma
  implements FinanceNumberRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_financeiro_numero;

  async insert(
    data: Prisma.smartnewsystem_financeiro_numeroUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_numero> {
    const number = await this.table.create({
      data,
    });

    return number;
  }

  async findLastNumber(clientId: number): Promise<number> {
    const number = await this.table.findMany({
      where: {
        id_cliente: clientId,
      },
    });

    return number.length > 0 ? number[number.length - 1].numero : 0;
  }
}
