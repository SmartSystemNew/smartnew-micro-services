export interface IAttachmentsServiceOrder {
  findById: {
    id: number;
    id_cliente?: number | null;
    id_filial?: number | null;
    id_ordem_servico?: number;
    anexo?: Uint8Array | null;
    nome_anexo?: string | null;
    tamanho_anexo?: string | null;
    observacao?: string | null;
    log_date: Date;
    log_user?: string | null;
  };
  listByServiceOrder: {
    id: number;
    id_cliente?: number | null;
    id_filial?: number | null;
    id_ordem_servico?: number;
    anexo?: Uint8Array | null;
    nome_anexo?: string | null;
    tamanho_anexo?: string | null;
    observacao?: string | null;
    log_date: Date;
    log_user?: string | null;
    url: string | null;
  };
}
