export default interface IFinanceTypePayment {
  listByClient: {
    id: number;
    descricao: string;
    parcela: number;
  };
  findById: {
    id: number;
    descricao: string;
    parcela: number;
  };
}
