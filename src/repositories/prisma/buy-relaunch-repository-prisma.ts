import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_compras_relancamento } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import BuyRelaunchRepository from '../buy-relaunch-repository';

@Injectable()
export default class BuyRelaunchRepositoryPrisma
  implements BuyRelaunchRepository
{
  constructor(private prismaService: PrismaService) {}

  table = this.prismaService.smartnewsystem_compras_relancamento;

  async findByBuy(
    buyId: number,
  ): Promise<smartnewsystem_compras_relancamento | null> {
    const relaunch = await this.table.findFirst({
      where: {
        id_compra: buyId,
      },
    });

    return relaunch;
  }

  async create(
    data: Prisma.smartnewsystem_compras_relancamentoUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_relancamento> {
    const relaunch = await this.table.create({
      data,
    });

    return relaunch;
  }
}
