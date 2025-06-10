import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_compras_item_motivo_cotacao,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import BuyItemQuotationReasonRepository from '../buy-item-quotation-reason-repository';

@Injectable()
export default class BuyItemQuotationReasonRepositoryPrisma
  implements BuyItemQuotationReasonRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_item_motivo_cotacao;

  async findByProviderAndItem(
    providerId: number,
    itemId: number,
  ): Promise<smartnewsystem_compras_item_motivo_cotacao | null> {
    const reason = await this.table.findFirst({
      where: {
        id_fornecedor: providerId,
        id_item: itemId,
      },
    });

    return reason;
  }

  async create(
    data: Prisma.smartnewsystem_compras_item_motivo_cotacaoUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_item_motivo_cotacao> {
    const reason = await this.table.create({ data });
    return reason;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_compras_item_motivo_cotacaoUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_item_motivo_cotacao> {
    const reason = await this.table.update({ where: { id }, data });
    return reason;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });
    return true;
  }
}
