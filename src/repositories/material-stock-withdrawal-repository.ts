import {
  smartnewsystem_material_estoque_retirada,
  Prisma,
} from '@prisma/client';
import { IMaterialStockWithDrawal } from 'src/models/IMaterialStockWithdrawal';

export default abstract class MaterialStockWithDrawalRepository {
  abstract findById(
    id: number,
  ): Promise<smartnewsystem_material_estoque_retirada | null>;
  abstract listWithdrawal(
    branches: number[],
  ): Promise<IMaterialStockWithDrawal['listWithdrawal'][]>;

  abstract create(
    data: Prisma.smartnewsystem_material_estoque_retiradaUncheckedCreateInput,
  ): Promise<smartnewsystem_material_estoque_retirada>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_material_estoque_retiradaUncheckedUpdateInput,
  ): Promise<smartnewsystem_material_estoque_retirada>;
}
