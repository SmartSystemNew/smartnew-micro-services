import {
  Prisma,
  smartnewsystem_producao_categoria_diversos,
} from '@prisma/client';
import {
  IProductionCategoryDiverseFindById,
  IProductionCategoryDiverseListByClient,
} from 'src/models/IProductionCategoryDiverse';

export default abstract class ProductionCategoryDiverseRepository {
  abstract findById(
    id: number,
  ): Promise<IProductionCategoryDiverseFindById | null>;
  abstract listByClient(
    clientId: number,
  ): Promise<IProductionCategoryDiverseListByClient[]>;
  abstract create(
    data: Prisma.smartnewsystem_producao_categoria_diversosUncheckedCreateInput,
  ): Promise<smartnewsystem_producao_categoria_diversos>;
  abstract update(
    id: number,
    data: Prisma.smartnewsystem_producao_categoria_diversosUncheckedUpdateInput,
  ): Promise<smartnewsystem_producao_categoria_diversos>;
  abstract delete(id: number): Promise<boolean>;
}
