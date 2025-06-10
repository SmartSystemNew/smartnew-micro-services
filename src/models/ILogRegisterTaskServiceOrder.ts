export default interface ILogRegisterTaskServiceOrder {
  listRegisterTaskServiceOrder: {
    id: number;
    id_app: string;
    id_tarefa_servico: number;
    id_registro: number;
    inicio: Date;
    fim: Date;
    acao: string;
    log_date: Date;
    registerHour: {
      taskServiceOrder: {
        serviceOrder: {
          ID: number;
        };
      };
    };
  }[];
}
