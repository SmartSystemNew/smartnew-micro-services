export default interface IFinanceTributes {
  listByClient: {
    id: number;
    descricao: string;
  };
  findById: {
    id: number;
    descricao: string;
  };
}
