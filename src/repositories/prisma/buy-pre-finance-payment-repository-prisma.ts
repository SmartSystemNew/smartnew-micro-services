import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_compras_pre_financeiro_pagamento,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import BuyPreFinancePaymentRepository from '../buy-pre-finance-payment-repository';
import IBuyPreFinancePayment from 'src/models/IBuyPreFinancePayment';

@Injectable()
export default class BuyPreFinancePaymentRepositoryPrisma
  implements BuyPreFinancePaymentRepository
{
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService.smartnewsystem_compras_pre_financeiro_pagamento;

  async listByBuy(
    buyId: number,
  ): Promise<IBuyPreFinancePayment['listByBuy'][]> {
    const payments = await this.table.findMany({
      select: {
        id: true,
        vencimento: true,
        paymentType: {
          select: {
            id: true,
            descricao: true,
          },
        },
        provider: {
          select: {
            ID: true,
            nome_fantasia: true,
          },
        },
      },
      where: {
        buyPreFinance: {
          id_compra: buyId,
        },
      },
    });

    return payments;
  }

  async create(
    data: Prisma.smartnewsystem_compras_pre_financeiro_pagamentoUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_pre_financeiro_pagamento> {
    const payment = await this.table.create({ data });
    return payment;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_compras_pre_financeiro_pagamentoUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_pre_financeiro_pagamento> {
    const payment = await this.table.update({
      where: { id },
      data,
    });
    return payment;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }
}
