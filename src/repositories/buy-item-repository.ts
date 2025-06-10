import {
  Prisma,
  smartnewsystem_compras_item_solicitacao,
} from '@prisma/client';
import IBuyItem from 'src/models/IBuyItem';

export default abstract class BuyItemRepository {
  abstract listByBuyAndNotStock(
    buyId: number,
  ): Promise<IBuyItem['listByBuyAndNotStock'][]>;

  abstract listByBuyAndStock(
    buyId: number,
  ): Promise<IBuyItem['listByBuyAndStock'][]>;

  abstract findById(
    id: number,
  ): Promise<smartnewsystem_compras_item_solicitacao | null>;

  abstract findByBuyAndMaterialService(
    buyId: number,
    materialServiceId: number,
  ): Promise<smartnewsystem_compras_item_solicitacao | null>;
  abstract listByBuy(buyId: number): Promise<IBuyItem['listByBuy'][]>;
  abstract create(
    data: Prisma.smartnewsystem_compras_item_solicitacaoUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_item_solicitacao>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_compras_item_solicitacaoUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_item_solicitacao>;

  abstract delete(id: number): Promise<true>;
}
