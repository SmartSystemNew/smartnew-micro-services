export interface InfoTableResponse {
  id: number;
  actionId: number | null;
  responsible: {
    login: string;
    name: string;
  } | null;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  // equipment: string | null;
  // location: string | null;
  item: string;
  task: string;
  branch: string;
  branchId: number;
  doneAt: Date | null;
  descriptionAction: string | null;
  status: 'EM ABERTO' | 'EM ANDAMENTO' | 'VENCIDO' | 'CONCLUÍDO';
}

export interface InfoTableGroupResponse {
  id: number;
  code: number;
  responsible: {
    login: string;
    name: string;
  } | null;
  title: string | null;
  task: string | null;
  startDate: Date;
  endDate: Date | null;
  // equipment: string | null;
  // location: string | null;
  item: string;
  description: string;
  descriptionAction: string;
  branch: string;
  doneAt: Date | null;
  status: 'EM ABERTO' | 'EM ANDAMENTO' | 'VENCIDO' | 'CONCLUÍDO';
}
