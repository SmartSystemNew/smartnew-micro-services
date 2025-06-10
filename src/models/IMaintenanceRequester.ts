export default interface IMaintenanceRequester {
  findById: {
    id: number;
    status: number;
    observacoes: string;
    nome: string;
    email: string;
    notificacao: number;
    branch: {
      ID: number;
      filial_numero: string;
    };
  };
  listByBranches: {
    id: number;
    status: number;
    observacoes: string;
    nome: string;
    email: string;
    notificacao: number;
    branch: {
      ID: number;
      filial_numero: string;
    };
  };
  listByClient: {
    id: number;
    status: number;
    observacoes: string;
    nome: string;
    email: string;
    notificacao: number;
    log_date: Date;
    branch: {
      ID: number;
      filial_numero: string;
    };
  };
}
