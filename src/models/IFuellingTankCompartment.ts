import { Decimal } from '@prisma/client/runtime/library';

export default interface IFuellingTankCompartment {
  findByTank: {
    id: number;
    capacidade: number;
    quantidade: number;
    fuel: {
      id: number;
      descricao: string;
    };
    tankInlet: {
      id: number;
      fuel: {
        id: number;
        descricao: string;
      };
      data: Date;
      qtd_litros: number;
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
      data_abastecimento: Date;
      quantidade: Decimal;
      fuel: {
        id: number;
        descricao: string;
      };
    }[];
  };
  findById: {
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
    tankInlet: {
      id: number;
      fuel: {
        id: number;
        descricao: string;
      };
      data: Date;
      qtd_litros: number;
    }[];
    fuelling: {
      id: number;
      data_abastecimento: Date;
      quantidade: Decimal;
      hodometro_tanque: number;
      fuel: {
        id: number;
        descricao: string;
      };
    }[];
  };
}
