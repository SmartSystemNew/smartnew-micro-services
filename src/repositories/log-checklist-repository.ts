import { Prisma, log_checklist_smartnewsystem } from '@prisma/client';

export default abstract class LogChecklistRepository {
  abstract list(): Promise<log_checklist_smartnewsystem[]>;
  abstract create(
    data: Prisma.log_checklist_smartnewsystemUncheckedCreateInput,
  ): Promise<log_checklist_smartnewsystem>;
}
