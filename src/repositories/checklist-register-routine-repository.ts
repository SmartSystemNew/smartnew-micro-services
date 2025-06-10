import {
  smartnewsystem_checklist_registro_automatico,
  Prisma,
} from '@prisma/client';

export default abstract class ChecklistRegisterRoutineRepository {
  abstract findByModelAndEquipment(
    modelId: number,
    equipmentId: number,
  ): Promise<smartnewsystem_checklist_registro_automatico | null>;

  abstract create(
    data: Prisma.smartnewsystem_checklist_registro_automaticoUncheckedCreateInput,
  ): Promise<smartnewsystem_checklist_registro_automatico>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_checklist_registro_automaticoUncheckedUpdateInput,
  ): Promise<smartnewsystem_checklist_registro_automatico>;

  abstract delete(id: number): Promise<boolean>;
}
