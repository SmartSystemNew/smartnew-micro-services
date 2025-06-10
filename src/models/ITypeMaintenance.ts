export interface ITypeMaintenance {
  listByClient: {
    ID: number;
    ID_cliente?: number;
    ID_filial?: number;
    sigla?: string;
    tipo_manutencao?: string;
    padrao?: string;
    id_grupo?: number;
    status?: boolean;
    ordem_programada: number;
    observacoes?: string;
    notifica_encerramento?: string;
    incluir_solicitacao?: number;
    id_plano_padrao?: number;
    log_user?: string;
    log_date: Date;
  };
  findById: {
    ID: number;
    ID_cliente?: number;
    ID_filial?: number;
    sigla?: string;
    tipo_manutencao?: string;
    padrao?: string;
    id_grupo?: number;
    status?: boolean;
    ordem_programada: number;
    observacoes?: string;
    notifica_encerramento?: string;
    incluir_solicitacao?: number;
    id_plano_padrao?: number;
    log_user?: string;
    log_date: Date;
  };
}
