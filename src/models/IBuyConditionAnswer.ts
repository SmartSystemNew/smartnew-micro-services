export default interface IBuyConditionAnswer {
  listByBuyAndProvider: {
    id: number;
    resposta: string;
    buy: {
      id: number;
      numero: number;
    };
    provider: {
      ID: number;
      razao_social: string;
    };
    condition: {
      id: number;
      condicao: string;
      editavel: number;
    };
  };
}
