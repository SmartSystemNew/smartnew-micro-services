export default interface IBuyPreFinance {
  listByBuy: {
    id: number;
    buy: {
      id: number;
      numero: number;
    };
    buyPreFinancePayment: {
      id: number;
      vencimento: Date;
      quantidade_parcela: number;
      parcelar: number;
      frequencia: number;
      frequencia_fixa: number;
      provider: {
        ID: number;
        nome_fantasia: string;
      };
      paymentType: {
        id: number;
        descricao: string;
      };
    }[];
  };
  findByBuyAndProvider: {
    id: number;
    buy: {
      id: number;
      numero: number;
    };
    buyPreFinancePayment: {
      id: number;
      vencimento: Date;
      quantidade_parcela: number;
      parcelar: number;
      frequencia: number;
      frequencia_fixa: number;
      provider: {
        ID: number;
        nome_fantasia: string;
      };
      paymentType: {
        id: number;
        descricao: string;
      };
    }[];
  };
}
