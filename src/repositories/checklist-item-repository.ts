import {
  Prisma,
  smartnewsystem_producao_checklist_itens,
} from '@prisma/client';
import { ICheckListTaskListByCheckList } from 'src/models/ICheckListItem';

export abstract class CheckListItemRepository {
  abstract findByCheckListAndTask(
    checklistId: number,
    taskId: number,
  ): Promise<smartnewsystem_producao_checklist_itens | null>;

  abstract listByCheckList(
    checkListId: number,
    filter:
      | Prisma.smartnewsystem_producao_checklist_itensWhereInput
      | undefined,
  ): Promise<ICheckListTaskListByCheckList[]>;

  abstract listByTask(
    taskId: number,
  ): Promise<smartnewsystem_producao_checklist_itens[]>;

  abstract create(
    data: Prisma.smartnewsystem_producao_checklist_itensUncheckedCreateInput,
  ): Promise<smartnewsystem_producao_checklist_itens>;

  abstract update(
    data: Prisma.smartnewsystem_producao_checklist_itensUncheckedUpdateInput,
    id: number,
  ): Promise<smartnewsystem_producao_checklist_itens>;

  abstract delete(id: number): Promise<boolean>;
}
