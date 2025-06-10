import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_financeiro_controle } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import FinanceControlRepository from '../finance-control-repository';

@Injectable()
export default class FinanceControlRepositoryPrisma
  implements FinanceControlRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_financeiro_controle;

  async insert(
    data: Prisma.smartnewsystem_financeiro_controleUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_controle> {
    const control = await this.table.create({
      data,
    });

    return control;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_financeiro_controleUncheckedUpdateInput,
  ): Promise<smartnewsystem_financeiro_controle> {
    const control = await this.table.update({
      where: { id },
      data,
    });

    return control;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }
}
