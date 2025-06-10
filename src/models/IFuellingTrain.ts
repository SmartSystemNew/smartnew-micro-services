import { Decimal } from '@prisma/client/runtime/library';

export interface IFuellingTrain {
  listByBranches: {
    id: number;
    tag: string;
    placa: string;
    capacidade: number;
    branch: {
      ID: number;
      filial_numero: string;
    };
    fuellingUser: {
      id: number;
      user: {
        login: string;
        name: string;
      };
      codigo: string;
    }[];
    trainFuel: {
      id: number;
      capacidade: number;
      quantidade: number;
      fuel: {
        id: number;
        descricao: string;
      };
      inputProduct: {
        id: number;
        quantidade: number;
        valor: number;
        input: {
          id: number;
          data: Date;
        };
      }[];
      fuelling: {
        id: number;
        quantidade: Decimal;
        hodometro_tanque: number | null;
        fuel: {
          id: number;
          descricao: string;
        };
        data_abastecimento: Date;
      }[];
      trainInlet: {
        id: number;
        fuel: {
          id: number;
          descricao: string;
        };
        data: Date;
        qtd_litros: number;
      }[];
    }[];
  };
  findById: {
    id: number;
    tag: string;
    placa: string;
    capacidade: number;
    branch: {
      ID: number;
      filial_numero: string;
    };
    fuellingUser: {
      id: number;
      user: {
        login: string;
        name: string;
      };
      codigo: string;
    }[];
    trainFuel: {
      id: number;
      capacidade: number;
      quantidade: number;
      fuel: {
        id: number;
        descricao: string;
      };
      inputProduct: {
        id: number;
        quantidade: number;
        valor: number;
      }[];
      fuelling: {
        id: number;
        quantidade: Decimal;
        hodometro_tanque: number | null;
        fuel: {
          id: number;
          descricao: string;
        };
        data_abastecimento: Date;
      }[];
      trainInlet: {
        id: number;
        fuel: {
          id: number;
          descricao: string;
        };
        data: Date;
        qtd_litros: number;
      }[];
    }[];
  };
  listFuellingByBranches: {
    id: number;
    tag: string;
    placa: string;
    trainFuel: {
      capacidade: number;
      fuelling: {
        id: number;
        quantidade: Decimal;
        hodometro_tanque: number | null;
        fuel: {
          id: number;
          descricao: string;
        };
      }[];
      id: number;
      quantidade: number;
      fuel: {
        id: number;
        descricao: string;
      };
      inputProduct: {
        id: number;
        quantidade: number;
        valor: number;
      }[];
      trainInlet: {
        id: number;
        qtd_litros: number;
      }[];
    }[];
  };
}
