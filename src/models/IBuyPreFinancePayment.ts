export default interface IBuyPreFinancePayment {
  listByBuy: {
    id: number;
    vencimento: Date;
    provider: {
      ID: number;
      nome_fantasia: string;
    };
    paymentType: {
      id: number;
      descricao: string;
    };
  };
}
