export default interface ILogNoteStopServiceOrder {
  findById: {
    id: number;
    id_ordem_servico: number;
    id_app: string;
    id_apontamento_parada: number;
    acao: string;
    data_hora_stop: Date;
    data_hora_start: Date;
    observacoes: string;
    log_date: Date;
    serviceOrder: {
      ID: number;
      ordem: string;
    };
  };
  listByServiceOrder: {
    id: number;
    data_hora_stop: Date;
    data_hora_start: Date;
    observacoes: string;
    log_date: Date;
  };
}
