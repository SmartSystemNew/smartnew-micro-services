export default interface ILogTaskListOption {
  listByClient: {
    id: number;
    id_app: string;
    acao: string;
    id_tarefa_lista: number;
    id_tarefa: number;
    id_tarefa_opcao: number;
    task: {
      id: number;
      tarefa: string;
    };
  };
}
