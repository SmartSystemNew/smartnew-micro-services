import { Prisma, smartnewsystem_compras_pre_financeiro } from '@prisma/client';
import IBuyPreFinance from 'src/models/IBuyPreFinance';

export default abstract class BuyPreFinanceRepository {
  abstract listByBuy(
    buyId: number,
  ): Promise<IBuyPreFinance['listByBuy'] | null>;

  abstract findByBuyAndProvider(
    buyId: number,
    providerId: number,
  ): Promise<IBuyPreFinance['findByBuyAndProvider'] | null>;

  abstract create(
    data: Prisma.smartnewsystem_compras_pre_financeiroUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_pre_financeiro>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_compras_pre_financeiroUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_pre_financeiro>;

  abstract delete(id: number): Promise<boolean>;
}
