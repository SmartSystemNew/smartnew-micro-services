export default interface ILogRequestService {
  listByBranchesAndFilter: {
    id: number;
    acao: string;
    id_solicitacao: number;
    id_equipamento: number;
    codigo_solicitacao: string;
    assunto: string | null;
    mensagem: string;
    prioridade: string;
    status: number;
    data_prevista: Date;
    log_date: Date;
    id_problema: number;
    maquina_parada: number;
    data_equipamento_parou: Date | null;
    id_app: string;
    requestService: {
      id: number;
      id_app: string;
      orderService: {
        ID: number;
        ordem: string;
        log_date: Date;
        id_app: string;
      };
    } | null;
  };
}
