import {
  Prisma,
  smartnewsystem_compras_cotacao_desconto,
} from '@prisma/client';

export default abstract class BuyQuotationDiscountRepository {
  abstract findById(
    id: number,
  ): Promise<smartnewsystem_compras_cotacao_desconto | null>;
  abstract create(
    data: Prisma.smartnewsystem_compras_cotacao_descontoUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_cotacao_desconto>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_compras_cotacao_descontoUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_cotacao_desconto>;

  abstract delete(id: number): Promise<boolean>;

  abstract deleteByBuyAndProvider(
    buyId: number,
    providerId: number,
  ): Promise<boolean>;
}
