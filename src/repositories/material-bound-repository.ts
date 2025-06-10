import { smartnewsystem_material_vinculo, Prisma } from '@prisma/client';
import IMaterialBound from 'src/models/IMaterialBound';

export default abstract class MaterialBoundRepository {
  abstract findByMaterial(
    materialId: number,
  ): Promise<IMaterialBound['findByMaterial'][]>;

  abstract findByMaterialAndEquipment(
    materialId: number,
    equipmentId: number,
  ): Promise<smartnewsystem_material_vinculo | null>;

  abstract create(
    data: Prisma.smartnewsystem_material_vinculoUncheckedCreateInput,
  ): Promise<smartnewsystem_material_vinculo>;

  abstract update(
    boundId: number,
    data: Prisma.smartnewsystem_material_vinculoUpdateInput,
  ): Promise<smartnewsystem_material_vinculo>;

  abstract delete(boundId: number): Promise<boolean>;
}
