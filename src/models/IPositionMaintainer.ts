export interface IPositionMaintainer {
  findById: {
    id: number;
    id_cliente: number;
    descricao: string;
    log_date: Date;
  };
  list: {
    id: number;
    id_cliente: number;
    descricao: string;
    log_date: Date;
  }[];
}
