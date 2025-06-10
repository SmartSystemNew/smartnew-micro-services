export interface IContractTypeInput {
  listByClient: {
    id: number;
    insumo: string;
  };
  findByClientAndName: {
    id: number;
    insumo: string;
  };
  findById: {
    id: number;
    insumo: string;
  };
}
