export default interface IFinanceBankTransfer {
  listByClient: {
    id: number;
    valor: number;
    data_transferencia: Date;
    log_date: Date;
    branch: {
      ID: number;
      filial_numero: string;
    };
    bankOrigin: {
      id: number;
      nome: string;
    };
    bankDestination: {
      id: number;
      nome: string;
    };
    provider: {
      ID: number;
      razao_social: string | null;
    };
    composition: {
      id: number;
      composicao: string | null;
      descricao: string | null;
    };
    paymentType: {
      id: number;
      descricao: string;
    };
  };
  findById: {
    id: number;
    valor: number;
    data_transferencia: Date;
    log_date: Date;
    branch: {
      ID: number;
      filial_numero: string;
    };
    bankOrigin: {
      id: number;
      nome: string;
    };
    bankDestination: {
      id: number;
      nome: string;
    };
    provider: {
      ID: number;
      razao_social: string | null;
    };
    composition: {
      id: number;
      composicao: string | null;
      descricao: string | null;
    };
    financePay: {
      id: number;
      financeControl: {
        id: number;
      } | null;
      installmentFinance: {
        id: number;
        emissionItem: {
          id: number;
          emission: {
            id: number;
          };
        };
      }[];
    };
    financeReceive: {
      id: number;
      financeControl: {
        id: number;
      } | null;
      installmentFinance: {
        id: number;
        emissionItem: {
          id: number;
          emission: {
            id: number;
          };
        };
      }[];
    };
  };
}
