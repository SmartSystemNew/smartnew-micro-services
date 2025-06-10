export interface IListByClient {
  id: number;
  descricao: string;
}

export interface ICheckListTask {
  findById: {
    id: number;
    descricao: string;
    checkListItens: {
      checkList: {
        id: number;
      };
    }[];
  };
}
