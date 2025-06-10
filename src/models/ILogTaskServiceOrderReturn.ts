export default interface ILogTaskServiceOrderReturn {
  listByClient: {
    id: number;
    id_app: string;
    acao: string;
    id_tarefa_retorno: number;
    id_tarefa_servico: number;
    id_tarefa: number;
    retorno_texto: string;
    retorno_numero: number;
    retorno_opcao: number;
    taskReturn: {
      id: number;
      returnOption: {
        id: number;
        option: {
          id: number;
          descricao: string;
        };
      } | null;
    } | null;
  };
}
