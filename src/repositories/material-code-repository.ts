import { Prisma, smartnewsystem_material_codigo } from '@prisma/client';
import IMaterialCode from '../models/IMaterialCode';

export default abstract class MaterialCodeRepository {
  abstract listByMaterial(
    materialId: number,
  ): Promise<smartnewsystem_material_codigo[]>;

  abstract listByClient(
    clientId: number,
    index?: number | null,
    perPage?: number | null,
    filter?: Prisma.smartnewsystem_material_codigoWhereInput | null,
  ): Promise<IMaterialCode['listByClient'][]>;

  abstract listByTypeMaterial(
    clientId: number,
    index?: number | null,
    perPage?: number | null,
    filter?: Prisma.smartnewsystem_material_codigoWhereInput | null,
  ): Promise<IMaterialCode['listByTypeMaterial'][]>;

  abstract countListByClient(
    clientId: number,
    filter?: Prisma.smartnewsystem_material_codigoWhereInput | null,
  ): Promise<number>;
  abstract lisByMaterialAndCode(
    materialId: number,
  ): Promise<IMaterialCode['listByMaterialAndCode'][]>;

  abstract findDuplicateByMaterial(
    materialId: number,
    code: string,
  ): Promise<smartnewsystem_material_codigo | null>;

  abstract MaterialExistInMaterial(
    materialId: number,
    code: string,
    codeId: number,
  ): Promise<smartnewsystem_material_codigo | null>;

  abstract MaterialExist(
    code: string,
  ): Promise<smartnewsystem_material_codigo | null>;

  abstract findById(id: number): Promise<IMaterialCode['listById']>;

  abstract findByMaterial(
    idMaterial: number,
  ): Promise<IMaterialCode['findByMaterial'][]>;

  abstract listForReportStockByClient(
    clientId: number,
    index?: number | null,
    perPage?: number | null,
    currentDate?: Date | null,
    filter?: Prisma.smartnewsystem_material_codigoWhereInput | null,
  ): Promise<IMaterialCode['listForReportStockByClient'][]>;
  abstract create(
    data: Prisma.smartnewsystem_material_codigoUncheckedCreateInput,
  ): Promise<smartnewsystem_material_codigo>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_material_codigoUncheckedUpdateInput,
  ): Promise<smartnewsystem_material_codigo>;

  abstract delete(id: number): Promise<boolean>;
}
