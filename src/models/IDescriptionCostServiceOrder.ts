export interface IDescriptionCostServiceOrder {
  findById: {
    id: number;
    id_cliente?: number;
    descricao?: string;
    unidade?: string;
    observacao?: string;
    log_user?: string;
    log_date: Date;
    costServiceOrder: {
      id: number;
      observacoes: string;
    }[];
    company: {
      ID: number;
      razao_social: string;
    };
  };
  listByClient: {
    id: number;
    id_cliente?: number;
    descricao?: string;
    unidade?: string;
    observacao?: string;
    log_user?: string;
    log_date: Date;
    costServiceOrder: {
      id: number;
      observacoes: string;
    }[];
    company: {
      ID: number;
      razao_social: string;
    };
  };
}
