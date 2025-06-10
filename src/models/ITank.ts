import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface ITank {
  findById: {
    branch: {
      ID: number;
      filial_numero: string;
    };
    id_tanque: number;
    tanque: string;
    modelo: string;
    capacidade: number;
    estoque: number;
    hodometro: number;
    combustivel_atual: number;
    fuelling: {
      id: number;
      data_abastecimento: Date;
      quantidade: Decimal;
      hodometro_tanque: number | null;
    }[];
    fuellingTankFuel: {
      capacidade: number;
      tankInlet: {
        id: number;
        qtd_litros: number;
      }[];
      inputProduct: {
        id: number;
        quantidade: number;
        valor: number;
      }[];
      fuelling: {
        id: number;
        quantidade: Decimal;
        data_abastecimento: Date;
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
    }[];
  };
  findByClientAndModel: {
    branch: {
      ID: number;
      filial_numero: string;
    };
    id_tanque: number;
    tanque: string;
    modelo: string;
    capacidade: number;
    fuelling: {
      id: number;
      data_abastecimento: Date;
      quantidade: Prisma.Decimal;
      hodometro_tanque: number | null;
    }[];
  };
  listByClientAndBranches: {
    id_tanque: number;
    tanque: string;
    estoque: number;
    modelo: string;
    hodometro: number;
    combustivel_atual: number;
    capacidade: number | null;
    branch: {
      ID: number;
      filial_numero: string;
    } | null;
    fuelling: {
      id: number;
      data_abastecimento: Date;
      quantidade: Decimal;
      hodometro_tanque: number;
    }[];
    fuellingTankFuel: {
      capacidade: number;
      tankInlet: {
        id: number;
        qtd_litros: number;
        data: Date;
        fuel: {
          id: number;
          descricao: string;
        };
      }[];
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
        data_abastecimento: Date;
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
    }[];
  };
  listFuellingByBranches: {
    id_tanque: number;
    tanque: string;
    estoque: number;
    modelo: string;
    capacidade: number;
    hodometro: number;
    combustivel_atual: number;
    fuellingTankFuel: {
      capacidade: number;
      tankInlet: {
        id: number;
        qtd_litros: number;
        data: Date;
      }[];
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
      }[];
      id: number;
      quantidade: number;
      fuel: {
        id: number;
        descricao: string;
      };
    }[];
  };
}
