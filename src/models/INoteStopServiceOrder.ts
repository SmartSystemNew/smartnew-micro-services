export interface INoteStopServiceOrder {
  findById: {
    id: number;
    id_app: string;
    data_hora_stop?: Date;
    data_hora_start?: Date;
    observacoes?: string;
    entrada?: number;
    log_user?: string;
    log_date?: Date;
    id_equipamento?: number;
    equipment: {
      ID: number;
      equipamento_codigo: string;
    };
    id_ordem_servico?: number;
    serviceOrder: {
      ID: number;
      ordem: string;
    };
    id_causa?: number;
    failureCause: {
      id: number;
      descricao: string;
    };
    id_setor_executante?: number;
    sectorExecutor: {
      Id: number;
      descricao: string;
    };
    id_lote?: number;
    noteStopBatch: {
      id: number;
      observacoes: string;
    };
  };
  listByServiceOrder: {
    id: number;
    id_app: string;
    data_hora_stop?: Date;
    data_hora_start?: Date;
    observacoes?: string;
    entrada?: number;
    log_user?: string;
    log_date?: Date;
    id_equipamento?: number;
    equipment: {
      ID: number;
      equipamento_codigo: string;
    };
    id_ordem_servico?: number;
    serviceOrder: {
      ID: number;
      ordem: string;
    };
    id_causa?: number;
    failureCause: {
      id: number;
      descricao: string;
    };
    id_setor_executante?: number;
    sectorExecutor: {
      Id: number;
      descricao: string;
    };
    id_lote?: number;
    noteStopBatch: {
      id: number;
      observacoes: string;
    };
  };
}
