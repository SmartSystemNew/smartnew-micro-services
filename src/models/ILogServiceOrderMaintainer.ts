export default interface ILogServiceOrderMaintainer {
  listByMaintainerAndOrders: {
    id: number;
    id_app: string;
    acao: string;
    id_mantenedores_os: number;
    id_ordem_servico: number;
    id_colaborador: number;
    log_date: Date;
  };
}
