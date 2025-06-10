export interface ISectorExecuting {
  listByClient: {
    Id: number;
    id_cliente?: number;
    id_grupo?: number;
    descricao?: string;
    padrao?: boolean;
    log_user?: string;
    log_date?: Date;
  };
  findById: {
    Id: number;
    id_cliente?: number;
    id_grupo?: number;
    descricao?: string;
    padrao?: boolean;
    log_user?: string;
    log_date?: Date;
  };
  findByClientAndSector: {
    Id: number;
    id_cliente?: number;
    id_grupo?: number;
    descricao?: string;
    padrao?: boolean;
    log_user?: string;
    log_date?: Date;
  };
}
