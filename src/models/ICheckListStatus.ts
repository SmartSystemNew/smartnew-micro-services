import { $Enums } from '@prisma/client';

export interface CheckListStatusFindById {
  id: number;
  descricao: string;
  icone: string;
  cor: $Enums.smartnewsystem_producao_checklist_status_cor;
  acao: boolean;
  checkListControl?: {
    descricao: string;
  };
}
