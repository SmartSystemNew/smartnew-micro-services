import {
  Prisma,
  smartnewsystem_checklist_categoria_diverso,
} from '@prisma/client';

export default abstract class ChecklistCategoryDiverseRepository {
  abstract listByClient(
    clientId: number,
  ): Promise<smartnewsystem_checklist_categoria_diverso[]>;

  abstract create(
    data: Prisma.smartnewsystem_checklist_categoria_diversoUncheckedCreateInput,
  ): Promise<smartnewsystem_checklist_categoria_diverso>;

  abstract findById(
    id: number,
  ): Promise<smartnewsystem_checklist_categoria_diverso | null>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_checklist_categoria_diversoUncheckedUpdateInput,
  ): Promise<smartnewsystem_checklist_categoria_diverso>;

  abstract delete(id: number): Promise<boolean>;
}
