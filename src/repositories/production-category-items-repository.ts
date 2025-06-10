import { Prisma, smartnewsystem_producao_item_diversos } from '@prisma/client';
import { IProductionCategoryItemsListByDiverse } from 'src/models/IProductionCategoryItems';

export abstract class ProductionCategoryItemsRepository {
  abstract listByDiverse(
    diverseId: number,
  ): Promise<IProductionCategoryItemsListByDiverse[]>;

  abstract create(
    data: Prisma.smartnewsystem_producao_item_diversosUncheckedCreateInput,
  ): Promise<smartnewsystem_producao_item_diversos>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_producao_item_diversosUncheckedUpdateInput,
  ): Promise<smartnewsystem_producao_item_diversos>;

  abstract delete(id: number): Promise<boolean>;
}
