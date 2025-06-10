import {
  smartnewsystem_producao_checklist_controle,
  smartnewsystem_producao_checklist_tarefas,
} from '@prisma/client';

export interface ICheckListTaskListByCheckList {
  id: number;
  checkListTask: smartnewsystem_producao_checklist_tarefas;
  checkListControl: smartnewsystem_producao_checklist_controle;
}
