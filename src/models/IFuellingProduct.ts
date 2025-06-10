export default interface IFuellingProduct {
  findByClientAndName: {
    id: number;
    descricao: string;
    unidade: string;
  };
  findById: {
    id: number;
    descricao: string;
    unidade: string;
    fuelling: {
      id: number;
      data_abastecimento: Date;
    }[];
  };
  listByClient: {
    id: number;
    descricao: string;
    unidade: string;
  };
}
