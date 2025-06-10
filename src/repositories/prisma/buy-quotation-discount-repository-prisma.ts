import {
  Prisma,
  smartnewsystem_compras_cotacao_desconto,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import BuyQuotationDiscountRepository from '../buy-quotation-discount-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class BuyQuotationDiscountRepositoryPrisma
  implements BuyQuotationDiscountRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_cotacao_desconto;

  async findById(
    id: number,
  ): Promise<smartnewsystem_compras_cotacao_desconto | null> {
    const discount = await this.table.findUnique({
      where: {
        id,
      },
    });

    return discount;
  }

  async create(
    data: Prisma.smartnewsystem_compras_cotacao_descontoUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_cotacao_desconto> {
    const discount = await this.table.create({ data });

    return discount;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_compras_cotacao_descontoUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_cotacao_desconto> {
    const discount = await this.table.update({ where: { id }, data });

    return discount;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }

  async deleteByBuyAndProvider(
    buyId: number,
    providerId: number,
  ): Promise<boolean> {
    await this.table.deleteMany({
      where: { id_compra: buyId, id_fornecedor: providerId },
    });

    return true;
  }
}
