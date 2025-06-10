export default interface IFinanceTypeDocument {
  listByClient: {
    id: number;
    descricao: string;
    requer_chave: boolean;
    numeracao_automatica: boolean;
    finance: {
      id: number;
      documento_numero: string;
      numero_fiscal: string;
    }[];
    numberTypeDocument: {
      id: number;
      numero: number;
    }[];
  };
  findById: {
    id: number;
    descricao: string;
    requer_chave: boolean;
  };
  findByClientAndName: {
    id: number;
    descricao: string;
    requer_chave: boolean;
  };
}
