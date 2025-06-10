import {
  Prisma,
  smartnewsystem_compras_item_motivo_cotacao,
} from '@prisma/client';

export default abstract class BuyItemQuotationReasonRepository {
  abstract findByProviderAndItem(
    providerId: number,
    itemId: number,
  ): Promise<smartnewsystem_compras_item_motivo_cotacao | null>;
  abstract create(
    data: Prisma.smartnewsystem_compras_item_motivo_cotacaoUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_item_motivo_cotacao>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_compras_item_motivo_cotacaoUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_item_motivo_cotacao>;

  abstract delete(id: number): Promise<boolean>;
}
