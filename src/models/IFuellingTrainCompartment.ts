import { Decimal } from '@prisma/client/runtime/library';

export default interface IFuellingTrainCompartment {
  findById: {
    id: number;
    capacidade: number;
    quantidade: number;
    fuel: {
      id: number;
      descricao: string;
    };
    trainInlet: {
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
