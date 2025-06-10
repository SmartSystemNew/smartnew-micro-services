export interface ILogPositionMaintainer {
  findById: {
    id: number;
    id_cliente: number;
    id_descricao: number;
    descricao: string;
    acao: string;
    log_date: Date;
  };
  list: {
    id: number;
    id_cliente: number;
    id_descricao: number;
    descricao: string;
    acao: string;
    log_date: Date;
  };
}
