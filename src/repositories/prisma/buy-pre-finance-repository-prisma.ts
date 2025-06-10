import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_compras_pre_financeiro } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import IBuyPreFinance from 'src/models/IBuyPreFinance';
import BuyPreFinanceRepository from '../buy-pre-finance-repository';

@Injectable()
export default class BuyPreFinanceRepositoryPrisma
  implements BuyPreFinanceRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_pre_financeiro;

  async listByBuy(buyId: number): Promise<IBuyPreFinance['listByBuy'] | null> {
    const preFinance = await this.table.findFirst({
      select: {
        id: true,
        buy: {
          select: {
            id: true,
            numero: true,
          },
        },
        buyPreFinancePayment: {
          select: {
            id: true,
            quantidade_parcela: true,
            parcelar: true,
            vencimento: true,
            frequencia: true,
            frequencia_fixa: true,
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
        },
      },
      where: {
        id_compra: buyId,
      },
    });

    return preFinance;
  }

  async findByBuyAndProvider(
    buyId: number,
    providerId: number,
  ): Promise<IBuyPreFinance['findByBuyAndProvider'] | null> {
    const preFinance = await this.table.findFirst({
      select: {
        id: true,
        buy: {
          select: {
            id: true,
            numero: true,
          },
        },
        buyPreFinancePayment: {
          select: {
            id: true,
            quantidade_parcela: true,
            parcelar: true,
            vencimento: true,
            frequencia: true,
            frequencia_fixa: true,
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
        },
      },
      where: {
        id_compra: buyId,
        buyPreFinancePayment: {
          some: {
            id_fornecedor: providerId,
          },
        },
      },
    });

    return preFinance;
  }

  async create(
    data: Prisma.smartnewsystem_compras_pre_financeiroUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_pre_financeiro> {
    const preFinance = await this.table.create({
      data,
    });

    return preFinance;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_compras_pre_financeiroUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_pre_financeiro> {
    const preFinance = await this.table.update({
      where: { id },
      data,
    });

    return preFinance;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: { id },
    });

    return true;
  }
}
