import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_financeiro_emissao } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import FinanceEmissionRepository from '../finance-emission-repository';

@Injectable()
export default class FinanceEmissionRepositoryPrisma
  implements FinanceEmissionRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_financeiro_emissao;

  async create(
    data: Prisma.smartnewsystem_financeiro_emissaoUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_emissao> {
    const emission = await this.table.create({ data });
    return emission;
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
