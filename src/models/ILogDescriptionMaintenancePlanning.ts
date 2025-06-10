export default interface ILogDescriptionMaintenancePlanning {
  listByWhere: {
    id: number;
    acao: string;
    descriptionPlanning: {
      id: number;
      descricao: string;
      taskPlanningMaintenance: {
        id: number;
        task: {
          id: number;
          tarefa: string;
        };
      }[];
    };
  };
}
