import {
  Prisma,
  smartnewsystem_producao_checklist_tarefas,
} from '@prisma/client';
import { ICheckListTask, IListByClient } from 'src/models/ICheckListTask';

export abstract class CheckListTaskRepository {
  abstract findById(taskId: number): Promise<ICheckListTask['findById'] | null>;

  abstract findByClientAndTask(
    clientId: number,
    name: string,
  ): Promise<smartnewsystem_producao_checklist_tarefas | null>;

  abstract listByClient(
    clientId: number,
    filter:
      | Prisma.smartnewsystem_producao_checklist_tarefasWhereInput
      | undefined,
  ): Promise<IListByClient[]>;

  abstract create(
    data: Prisma.smartnewsystem_producao_checklist_tarefasUncheckedCreateInput,
  ): Promise<smartnewsystem_producao_checklist_tarefas>;

  abstract update(
    data: Prisma.smartnewsystem_producao_checklist_tarefasUncheckedUpdateInput,
    id: number,
  ): Promise<smartnewsystem_producao_checklist_tarefas>;

  abstract delete(id: number): Promise<boolean>;
}
