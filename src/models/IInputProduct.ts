import { Decimal } from '@prisma/client/runtime/library';

export default interface IInputProduct {
  listByInput: {
    id: number;
    valor: number;
    quantidade: number;
    fuelTank: {
      id: number;
      fuel: {
        id: number;
        descricao: string;
      };
    } | null;
    fuelTrain: {
      id: number;
      fuel: {
        id: number;
        descricao: string;
      };
    } | null;
  };
  findById: {
    id: number;
    valor: number;
    quantidade: number;
    input: {
      id: number;
      nota_fiscal: string;
      data: Date;
    };
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
    } | null;
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
    } | null;
  };
}
