import { Prisma, sofman_cad_materiais } from '@prisma/client';
import { IMaterial } from 'src/models/IMaterial';

export default abstract class MaterialRepository {
  abstract findMaterialAndBound(
    id: number,
  ): Promise<IMaterial['findMaterialAndBound'] | null>;

  abstract delete(id: number): Promise<boolean>;

  abstract listStockCodeSecond(
    clientId: number,
    start?: string | null,
    end?: string | null,
    secondId?: number[],
  ): Promise<IMaterial['listStockCodeSecond'][]>;

  abstract listStockCodeSecondInPage(
    clientId: number,
    index: number,
    perPage: number,
    start?: string | null,
    end?: string | null,
    secondId?: number[],
    filter?: string,
  ): Promise<IMaterial['listStockCodeSecondInPage'][]>;

  abstract countListStockCodeSecond(
    clientId: number,
    start?: string | null,
    end?: string | null,
    secondId?: number[],
    filter?: string,
  ): Promise<number>;

  abstract listStock(
    clientId: number,
    start?: string | null,
    end?: string | null,
    materialId?: number[],
  ): Promise<IMaterial['listStock'][]>;

  abstract groupStockByPrice(
    id: number,
  ): Promise<IMaterial['groupStockByPrice'][]>;

  abstract listForReportStockByClient(
    clientId: number,
    index?: number | null,
    perPage?: number | null,
    currentDate?: Date | null,
    filter?: Prisma.sofman_cad_materiaisWhereInput | null,
  ): Promise<IMaterial['listForReportStockByClient'][]>;
  abstract create(
    data: Prisma.sofman_cad_materiaisUncheckedCreateInput,
  ): Promise<sofman_cad_materiais>;

  abstract update(
    id: number,
    data: Prisma.sofman_cad_materiaisUncheckedUpdateInput,
  ): Promise<sofman_cad_materiais>;

  abstract listByClient(
    clientId: number,
    index?: number | null,
    perPage?: number | null,
  ): Promise<IMaterial['listByClient'][]>;
  abstract listByClientAndActive(
    clientId: number,
    filter?: Prisma.sofman_cad_materiaisWhereInput | null,
    index?: number | null,
    perPage?: number | null,
  ): Promise<IMaterial['listByClientAndActive'][]>;

  abstract countListByClientAndActive(
    clientId: number,
    filter?: Prisma.sofman_cad_materiaisWhereInput | null,
  ): Promise<number>;
  abstract findById(id: number): Promise<IMaterial['listById'] | null>;

  abstract findByClientAndMaterial(
    clientId: number,
    material: string,
  ): Promise<IMaterial['findByClientAndMaterial'] | null>;

  abstract findByClientAndCodeAndMaterial(
    clientId: number,
    code: string,
    material: string,
  ): Promise<IMaterial['findByClientAndMaterial'] | null>;
}
