export interface IServiceOrderStatus {
  listByClient: {
    id: number;
    id_cliente: number;
    status: string;
    requer_justificativa?: string;
    notifica_solicitante?: number;
    cor: string;
    cor_font: string;
    finalizacao: number;
    mostra_mantenedor: number;
    log_date: Date;
  };
  findById: {
    id: number;
    id_cliente: number;
    status: string;
    requer_justificativa?: string;
    notifica_solicitante?: number;
    cor: string;
    cor_font: string;
    finalizacao: number;
    mostra_mantenedor: number;
  };
  findByClientAndStatus: {
    id: number;
    id_cliente: number;
    status: string;
    requer_justificativa?: string;
    notifica_solicitante?: number;
    cor: string;
    cor_font: string;
    finalizacao: number;
    mostra_mantenedor: number;
  };
  choiceServiceOrderStatus: {
    id: number;
    status: string;
    finalizacao: number;
    requer_justificativa?: string;
    _count: {
      serviceOrder: number;
    };
  };
}
