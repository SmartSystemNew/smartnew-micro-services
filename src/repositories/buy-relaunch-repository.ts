import { smartnewsystem_compras_relancamento, Prisma } from '@prisma/client';

export default abstract class BuyRelaunchRepository {
  abstract findByBuy(
    buyId: number,
  ): Promise<smartnewsystem_compras_relancamento | null>;

  abstract create(
    data: Prisma.smartnewsystem_compras_relancamentoUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_relancamento>;
}
