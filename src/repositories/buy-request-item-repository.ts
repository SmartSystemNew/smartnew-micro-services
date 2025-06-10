import { Prisma, smartnewsystem_compras_pedidos_item } from '@prisma/client';
import IBuyRequestItem from 'src/models/IBuyRequestItem';

export default abstract class BuyRequestItemRepository {
  abstract findById(id: number): Promise<IBuyRequestItem['findById'] | null>;
  abstract findByItemAndStatus(
    itemId: number,
    statusId: number,
  ): Promise<smartnewsystem_compras_pedidos_item | null>;
  abstract listByRequest(
    requestId: number,
  ): Promise<IBuyRequestItem['listBuyRequest'][]>;

  abstract create(
    data: Prisma.smartnewsystem_compras_pedidos_itemUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_pedidos_item>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_compras_pedidos_itemUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_pedidos_item>;

  abstract delete(id: number): Promise<boolean>;
}
