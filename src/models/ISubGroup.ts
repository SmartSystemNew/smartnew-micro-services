export interface ISubGroup {
  findById: {
    id: number;
    id_filial: number;
    descricao?: string;
    users?: string;
    log_user?: string;
    log_date?: Date;
  };
  listByBranches: {
    id: number;
    id_filial: number;
    descricao?: string;
    users?: string;
    log_user?: string;
    log_date?: Date;
  };
}
