import { Prisma, smartnewsystem_compras_cotacao } from '@prisma/client';
import IBuyQuotation from 'src/models/IBuyQuotation';

export default abstract class BuyQuotationRepository {
  abstract findById(id: number): Promise<IBuyQuotation['findById'] | null>;

  abstract listByBuy(
    buyId: number,
    filter?: Prisma.smartnewsystem_compras_cotacaoWhereInput | null,
  ): Promise<IBuyQuotation['listByBuy'][]>;

  abstract listByProvider(
    providerId: number,
  ): Promise<IBuyQuotation['listByProvider'][]>;

  abstract findByBuyAndProvider(
    buyId: number,
    providerId: number,
  ): Promise<IBuyQuotation['findByBuyAndProvider'] | null>;

  abstract create(
    data: Prisma.smartnewsystem_compras_cotacaoUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_cotacao>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_compras_cotacaoUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_cotacao>;

  abstract delete(id: number): Promise<true>;
}
