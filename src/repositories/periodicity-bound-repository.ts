import { smartnewsystem_checklist_tipo_periocidade } from '@prisma/client';

export default abstract class PeriodicityBoundRepository {
  abstract list(): Promise<smartnewsystem_checklist_tipo_periocidade[]>;

  abstract findById(
    id: number,
  ): Promise<smartnewsystem_checklist_tipo_periocidade | null>;
}
