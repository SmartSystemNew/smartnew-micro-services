import {
  smartnewsystem_producao_checklist_controle,
  smartnewsystem_producao_checklist_status_acao,
} from '@prisma/client';

export interface CheckListStatusActionFindById {
  id: number;
  impeditivo: boolean;
  checkListStatus: {
    id: number;
    descricao: string;
  };
  checkListControl: {
    id: number;
    descricao: string;
  };
  descricao: string;
}

export interface CheckListStatusActionListByTaskAndStatus
  extends smartnewsystem_producao_checklist_status_acao {
  checkListControl: smartnewsystem_producao_checklist_controle;
}
