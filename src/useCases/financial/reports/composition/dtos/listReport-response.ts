import { Decimal } from '@prisma/client/runtime/library';

export interface ListReportResponse {
  id: number;
  categoryId: number;
  cost: number;
  code: string;
  name: string;
  categoryCode: string;
  category: string;
  month: string;
  item: {
    dueDate: Date | null;
    numberSplit: number | null;
    valueSplit: number | null;
    currentDate: Date;
    material: string;
    total: number;
    number: string;
    provider: string;
  }[];
}

export interface ListReportTestResponse {
  id: number;
  prorrogacao: Date | null;
  vencimento: Date;
  parcela: number;
  valor_parcela: number | Decimal;
  valor_a_pagar: number | Decimal;
  numero_fiscal: string;
  remetente: string;
  emitente: string;
  insumo: string;
  material: string;
  items: [
    {
      total: number | Decimal;
      compositionItem: {
        id: number;
        composicao: string;
        descricao: string;
        compositionGroup: {
          id: number;
          composicao: string;
          descricao: string;
          costCenter: {
            ID: number;
            centro_custo: string;
            descricao: string;
          };
        };
      };
    },
  ];
}
