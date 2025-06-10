export default interface ILogServiceOrder {
  listOnlyServiceOrderIdByBranchesAndFilter: {
    id: number;
    id_ordem: number;
    acao: string;
    id_solicitante: number;
    id_app: string;
  };
}
