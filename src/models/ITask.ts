export interface ITask {
  findById: {
    id: number;
    tarefa: string;
    retorno: string;
    tipo_dado: string | null;
    taskList: {
      id: number;
      option: {
        id: number;
        descricao: string;
      };
    }[];
  };
  listByClient: {
    id: number;
    id_cliente?: number;
    id_filial?: string;
    tarefa?: string;
    id_criticidade?: number;
    mascara?: number;
    tipo_dado: string | null;
    retorno: string;
    id_legenda_padrao?: number;
    id_unidade_vinculada?: number;
    obrigatorio: number;
    log_user?: string;
    log_date?: Date;
  };
}
