export interface IComponents {
  findById: {
    id: number;
    id_cliente: number;
    componente: string;
    observacoes?: string;
    log_user?: string;
    log_date: Date;
    failureAnalysis: { id: number }[];
    company: { ID: number; razao_social: string };
    planPrev: { ID: number }[];
    taskServiceOrder: { id: number }[];
    taskPlanMaintenance: { id: number }[];
  };
  listByClient: {
    id: number;
    id_cliente: number;
    componente: string;
    observacoes?: string;
    log_user?: string;
    log_date: Date;
    failureAnalysis: { id: number }[];
    company: { ID: number; razao_social: string };
    planPrev: { ID: number }[];
    taskServiceOrder: { id: number }[];
    taskPlanMaintenance: { id: number }[];
  };
}
