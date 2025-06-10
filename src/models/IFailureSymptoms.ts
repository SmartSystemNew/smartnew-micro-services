export interface IFailureSymptoms {
  findById: {
    id: number;
    id_cliente: number;
    descricao: string;
    log_user: string;
    log_date: Date;
    failureAnalysis: { id: number }[];
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
    failureAnalysis: { id: number }[];
    company: {
      ID: number;
      razao_social: string;
    };
  };
}
