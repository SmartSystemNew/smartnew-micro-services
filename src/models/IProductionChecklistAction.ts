export interface IFindByProductionAndItem {
  id: number;
  id_registro_producao: number;
  id_item: number;
  descricao: string;
  responsavel: string;
  data_inicio: Date;
  data_fim: Date;
  data_fechamento: Date;
  descricao_acao: string | null;
  log_date: Date;
  user: {
    login: string;
    name: string;
  };
}
