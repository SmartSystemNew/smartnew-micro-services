export default interface IDescriptionPlan {
  findById: {
    id: number;
    descricao: string;
    plans: {
      ID: number;
      task: {
        id: number;
        tarefa: string;
      };
    }[];
  };
  listByClientWithTask: {
    id: number;
    descricao: string;
    plans: {
      ID: number;
      task: {
        id: number;
        tarefa: string;
      };
    }[];
  };
}
