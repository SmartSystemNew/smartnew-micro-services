export default interface ILogAttachmentTaskServiceOrder {
  listByBranch: {
    id: number;
    acao: string | null;
    id_anexo: number | null;
    id_tarefa_servico: number | null;
    anexo: string | null;
    url: string | null;
    observacao: string | null;
    id_app: string | null;
    log_date: Date;
    taskService: {
      id: number;
      serviceOrder: {
        ID: number;
      };
    };
  };
}
