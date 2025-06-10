import { Prisma } from '@prisma/client';

export default interface IStockInventory {
  listOut: {
    id: number;
    numero_serie: string;
    data_entrada: Date;
    quantidade: Prisma.Decimal;
    valor_unitario: Prisma.Decimal;
    observacao: string;
    materialCodigo: {
      id: number;
      codigo: string;
    } | null;
    branch: {
      ID: number;
      filial_numero: string;
    };
    material: {
      id: number;
      material: string;
      unidade: string;
    };
  };
  findById: {
    id: number;
    numero_serie: string;
    data_entrada: Date;
    quantidade: Prisma.Decimal;
    valor_unitario: Prisma.Decimal;
    observacao: string;
    materialCodigo: {
      id: number;
      codigo: string;
    } | null;
    branch: {
      ID: number;
      filial_numero: string;
    };
    material: {
      id: number;
      material: string;
      unidade: string;
    };
  };
}
