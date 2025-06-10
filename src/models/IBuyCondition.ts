export default interface IBuyCondition {
  listByBuyAndProvider: {
    id: number;
    condicao: string;
    editavel: number;
    conditionAnswer: {
      id: number;
      resposta: string;
    }[];
  };
  listByBuy: {
    id: number;
    condicao: string;
    editavel: number;
    conditionAnswer: {
      id: number;
      resposta: string;
    }[];
  };
  listByClient: {
    id: number;
    condicao: string;
    editavel: number;
    conditionAnswer: {
      id: number;
      resposta: string;
      buy: {
        id: number;
        numero: number;
      };
      provider: {
        ID: number;
        nome_fantasia: string;
      };
    }[];
  };
}
