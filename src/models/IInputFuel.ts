import { Decimal } from '@prisma/client/runtime/library';

export default interface IInputFuel {
  listByClient: {
    id: number;
    nota_fiscal: string;
    data: Date;
    tank: {
      id_tanque: number;
      tanque: string;
      modelo: string;
    } | null;
    train: {
      id: number;
      tag: string;
      placa: string;
    } | null;
    provider: {
      ID: number;
      razao_social: string;
    };
    user: {
      login: string;
      name: string;
    };
    inputProduct: {
      id: number;
      valor: number;
      quantidade: number;
      fuelTank: {
        fuel: {
          id: number;
          descricao: string;
        };
      };
      fuelTrain: {
        fuel: {
          id: number;
          descricao: string;
        };
      };
    }[];
  };
  findById: {
    id: number;
    nota_fiscal: string;
    data: Date;
    tank: {
      id_tanque: number;
      tanque: string;
      modelo: string;
    } | null;
    train: {
      id: number;
      tag: string;
      placa: string;
    } | null;
    provider: {
      ID: number;
      razao_social: string;
    };
    user: {
      login: string;
      name: string;
    };
    inputProduct: {
      id: number;
      valor: number;
      quantidade: number;
      fuelTank: {
        id: number;
        fuelling: {
          id: number;
          quantidade: Decimal;
          data_abastecimento: Date;
        }[];
        fuel: {
          id: number;
          descricao: string;
        };
      };
      fuelTrain: {
        id: number;
        fuelling: {
          id: number;
          quantidade: Decimal;
          data_abastecimento: Date;
        }[];
        fuel: {
          id: number;
          descricao: string;
        };
      };
    }[];
  };
  findByClientAndFiscalAndProvider: {
    id: number;
    nota_fiscal: string;
    data: Date;
    tank: {
      id_tanque: number;
      tanque: string;
      modelo: string;
    } | null;
    train: {
      id: number;
      tag: string;
      placa: string;
    } | null;
    provider: {
      ID: number;
      razao_social: string;
    };
    user: {
      login: string;
      name: string;
    };
    inputProduct: {
      id: number;
      valor: number;
      quantidade: number;
      fuelTank: {
        id: number;
        fuelling: {
          id: number;
          quantidade: Decimal;
          data_abastecimento: Date;
        }[];
        fuel: {
          id: number;
          descricao: string;
        };
      };
      fuelTrain: {
        id: number;
        fuelling: {
          id: number;
          quantidade: Decimal;
          data_abastecimento: Date;
        }[];
        fuel: {
          id: number;
          descricao: string;
        };
      };
    }[];
  };
}
