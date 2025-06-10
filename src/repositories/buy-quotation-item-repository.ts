import { Prisma, smartnewsystem_compras_cotacao_item } from '@prisma/client';
import IBuyQuotationItem from 'src/models/IBuyQuotationItem';

export default abstract class BuyQuotationItemRepository {
  abstract listByBuyAndSelect(
    buyId: number,
  ): Promise<IBuyQuotationItem['listByBuyAndSelect'][]>;
  abstract findById(id: number): Promise<IBuyQuotationItem['findById'] | null>;
  abstract create(
    data: Prisma.smartnewsystem_compras_cotacao_itemUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_cotacao_item>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_compras_cotacao_itemUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_cotacao_item>;

  abstract delete(id: number): Promise<boolean>;
}
