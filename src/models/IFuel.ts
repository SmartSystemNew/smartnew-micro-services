export interface IFuel {
  listByClient: {
    id: number;
    descricao: string;
    unidade: string;
  };
  findById: {
    id: number;
    descricao: string;
    unidade: string;
  };
}
