export default interface IServiceOrderMaintainer {
  listAsyncMaintainers: {
    id: number;
    id_ordem_servico: number;
    id_colaborador: number;
  };
  listByBranch: {
    id: number;
    serviceOrder: {
      ID: number;
      ordem: string;
      log_date: Date | null;
      data_hora_encerramento: Date | null;
      data_hora_solicitacao: Date | null;
      data_prevista_termino: Date | null;
      branch: {
        ID: number;
        filial_numero: string;
      };
      equipment: {
        ID: number;
        equipamento_codigo: string;
        descricao: string;
      };
      statusOrderService: {
        id: number;
        status: string;
      };
    };
    collaborator: {
      id: number;
      nome: string;
    };
  };
}
