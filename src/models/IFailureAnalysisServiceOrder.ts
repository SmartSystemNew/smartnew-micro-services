export interface IFailureAnalysisServiceOrder {
  findById: {
    id: number;
    id_cliente?: number;
    id_filial?: number;
    id_ordem_servico?: number;
    id_familia?: number;
    id_tipo_equipamento?: number;
    id_equipamento?: number;
    id_componente?: number;
    id_sintoma?: number;
    id_causa?: number;
    id_acao?: number;
    log_user?: string;
    log_date?: Date;
  };
  listByServiceOrder: {
    id: number;
    id_cliente?: number;
    id_filial?: number;
    id_ordem_servico?: number;
    id_familia?: number;
    id_tipo_equipamento?: number;
    id_equipamento?: number;
    id_componente?: number;
    id_sintoma?: number;
    id_causa?: number;
    id_acao?: number;
    log_user?: string;
    log_date?: Date;
  };
}
