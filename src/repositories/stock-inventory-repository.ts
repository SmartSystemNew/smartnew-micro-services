import { Prisma, sofman_estoque_entrada } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import IStockInventory from 'src/models/IStockInventory';

export default abstract class StockInventoryRepository {
  abstract listOut(
    branches: number[],
    index: number,
    perPage: number,
    filter?: Prisma.sofman_estoque_entradaWhereInput | null,
  ): Promise<IStockInventory['listOut'][]>;

  abstract countList(
    branches: number[],
    filter?: Prisma.sofman_estoque_entradaWhereInput | null,
  ): Promise<number>;

  abstract findById(id: number): Promise<IStockInventory['findById'] | null>;
  abstract listByMaterial(
    materialId: number,
  ): Promise<sofman_estoque_entrada[]>;
  abstract sumGroupMaterialByBeforeDate(
    clientId: number,
    date: Date,
    materialId?: number[] | null,
  ): Promise<{ id_produto: number; quantity: Decimal }[]>;

  abstract sumGroupMaterialSecondaryByBeforeDate(
    clientId: number,
    date: Date,
    materialId?: number[] | null,
  ): Promise<{ id_codigo: number; quantity: Decimal }[]>;
  abstract create(
    data: Prisma.sofman_estoque_entradaUncheckedCreateInput,
  ): Promise<sofman_estoque_entrada>;

  abstract update(
    id: number,
    data: Prisma.sofman_estoque_entradaUncheckedUpdateInput,
  ): Promise<sofman_estoque_entrada>;

  abstract delete(id: number): Promise<boolean>;
}
