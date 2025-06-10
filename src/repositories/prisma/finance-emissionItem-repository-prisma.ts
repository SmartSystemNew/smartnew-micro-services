import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import FinanceEmissionItemRepository from '../finance-emissionItem-repository';
import {
  Prisma,
  smartnewsystem_financeiro_emissao_itens,
} from '@prisma/client';

@Injectable()
export default class FinanceEmissionItemRepositoryPrisma
  implements FinanceEmissionItemRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_financeiro_emissao_itens;

  async create(
    data: Prisma.smartnewsystem_financeiro_emissao_itensUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_emissao_itens> {
    const item = await this.table.create({ data });

    return item;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id,
      },
    });

    return true;
  }

  async deleteForPayment(paymentId: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id_pagamento: paymentId,
      },
    });

    return true;
  }
}
