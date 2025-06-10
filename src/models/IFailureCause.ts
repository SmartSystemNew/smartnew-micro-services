export interface IFailureCause {
  findById: {
    id: number;
    id_cliente: number;
    descricao: string;
    log_user: string;
    log_date: Date;
    serviceOrder: {
      ID: number;
      ordem: string;
    }[];
    failureAnalysis: {
      id: number;
    }[];
    noteStop: {
      id: number;
    }[];
    company: {
      ID: number;
      razao_social: string;
    };
  };
  listByClient: {
    id: number;
    id_cliente: number;
    descricao: string;
    log_user: string;
    log_date: Date;
    serviceOrder: {
      ID: number;
      ordem: string;
    }[];
    failureAnalysis: {
      id: number;
    }[];
    noteStop: {
      id: number;
    }[];
    company: {
      ID: number;
      razao_social: string;
    };
  };
}
