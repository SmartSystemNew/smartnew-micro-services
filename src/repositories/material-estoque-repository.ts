import { Prisma, smartnewsystem_material_estoque } from '@prisma/client';
import IWarehouseBuy from 'src/models/IWarehouseBuy';

export default abstract class MaterialEstoqueRepository {
  abstract groupByMaterialSecondApproved(
    branches: number[],
  ): Promise<IWarehouseBuy['groupByMaterialSecondApproved'][]>;
  abstract listByMaterial(
    materialId: number,
  ): Promise<smartnewsystem_material_estoque[]>;

  abstract findByMaterialServiceOrder(
    materialServiceId: number,
  ): Promise<smartnewsystem_material_estoque | null>;

  abstract findByBuyAndItem(
    buyId: number,
    itemId: number,
  ): Promise<IWarehouseBuy['findByBuyAndItem'] | null>;
  abstract findById(id: number): Promise<IWarehouseBuy['findById'] | null>;
  abstract create(
    data: Prisma.smartnewsystem_material_estoqueUncheckedCreateInput,
  ): Promise<smartnewsystem_material_estoque>;

  abstract findByMaterial(
    materialId: number,
    compraId: number,
    itemId: number,
  ): Promise<smartnewsystem_material_estoque | null>;

  abstract findByMaterialAndEstoque(
    branchId: number[],
    filter?: Prisma.smartnewsystem_material_estoqueWhereInput | null,
  ): Promise<IWarehouseBuy['listMaterial'][]>;

  abstract listWithDrawal(
    branchId: number[],
    filter?: Prisma.smartnewsystem_material_estoqueWhereInput | null,
  ): Promise<IWarehouseBuy['listWithDrawal'][]>;

  abstract findManyByCompra(
    idCompra: number,
  ): Promise<smartnewsystem_material_estoque[]>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_material_estoqueUncheckedUpdateInput,
  ): Promise<smartnewsystem_material_estoque>;

  abstract updateManyByCompra(
    idCompra: number,
    data: Prisma.smartnewsystem_material_estoqueUncheckedUpdateInput,
  ): Promise<any>;

  abstract findOne(
    where: Prisma.smartnewsystem_material_estoqueWhereUniqueInput,
  ): Promise<IWarehouseBuy['findOne'] | null>;

  abstract delete(id: number): Promise<boolean>;
}
