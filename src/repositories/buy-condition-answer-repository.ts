import {
  Prisma,
  smartnewsystem_compras_condicoes_respondidas,
} from '@prisma/client';
import IBuyConditionAnswer from 'src/models/IBuyConditionAnswer';

export default abstract class BuyConditionAnswerRepository {
  abstract findByBuyAndCondition(
    buyId: number,
    conditionId: number,
    providerId: number,
  ): Promise<smartnewsystem_compras_condicoes_respondidas | null>;
  abstract listByBuy(
    buyId: number,
  ): Promise<smartnewsystem_compras_condicoes_respondidas[]>;
  abstract listByCondition(
    conditionId: number,
  ): Promise<smartnewsystem_compras_condicoes_respondidas[]>;

  abstract listByBuyAndProvider(
    buyId: number,
    providerId: number,
  ): Promise<IBuyConditionAnswer['listByBuyAndProvider'][]>;

  abstract create(
    data: Prisma.smartnewsystem_compras_condicoes_respondidasUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_condicoes_respondidas>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_compras_condicoes_respondidasUpdateInput,
  ): Promise<smartnewsystem_compras_condicoes_respondidas>;

  abstract delete(id: number): Promise<boolean>;

  abstract deleteByBuy(buyId: number): Promise<boolean>;

  abstract deleteByBuyAndProvider(
    buyId: number,
    providerId: number,
  ): Promise<boolean>;
}
