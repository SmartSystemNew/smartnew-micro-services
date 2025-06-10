import { Prisma, smartnewsystem_compras_condicoes } from '@prisma/client';
import IBuyCondition from 'src/models/IBuyCondition';

export default abstract class BuyConditionRepository {
  abstract listByBuy(buyId: number): Promise<IBuyCondition['listByBuy'][]>;
  abstract listByBuyAndProvider(
    buyId: number,
    providerId: number,
  ): Promise<IBuyCondition['listByBuyAndProvider'][]>;

  abstract listByClient(
    clientId: number,
  ): Promise<IBuyCondition['listByClient'][]>;

  abstract findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<smartnewsystem_compras_condicoes | null>;

  abstract create(
    data: Prisma.smartnewsystem_compras_condicoesUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_condicoes>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_compras_condicoesUpdateInput,
  ): Promise<smartnewsystem_compras_condicoes>;

  abstract delete(id: number): Promise<boolean>;
}
