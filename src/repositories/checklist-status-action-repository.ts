import {
  Prisma,
  smartnewsystem_producao_checklist_status_acao,
} from '@prisma/client';
import {
  CheckListStatusActionFindById,
  CheckListStatusActionListByTaskAndStatus,
} from 'src/models/ICheckListStatusAction';

export abstract class CheckListStatusActionRepository {
  abstract findById(id: number): Promise<CheckListStatusActionFindById | null>;

  abstract listByTask(taskId: number): Promise<CheckListStatusActionFindById[]>;

  abstract listByTaskAndStatus(
    taskId: number,
    statusId: number,
  ): Promise<CheckListStatusActionListByTaskAndStatus[]>;

  abstract create(
    data: Prisma.smartnewsystem_producao_checklist_status_acaoUncheckedCreateInput,
  ): Promise<smartnewsystem_producao_checklist_status_acao>;

  abstract update(
    data: Prisma.smartnewsystem_producao_checklist_status_acaoUncheckedUpdateInput,
    id: number,
  ): Promise<smartnewsystem_producao_checklist_status_acao>;

  abstract delete(id: number): Promise<boolean>;
}
