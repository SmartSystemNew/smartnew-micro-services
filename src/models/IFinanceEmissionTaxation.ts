import { $Enums } from '@prisma/client';

export interface IFinanceEmissionTaxation {
  findById: {
    id: number;
    valor: number;
    observacao: string;
    tipo: $Enums.smartnewsystem_financeiro_emissao_tributos_tipo;
    taxation: {
      id: number;
      descricao: string;
    };
  };
  listByEmission: {
    id: number;
    valor: number;
    taxation: {
      id: number;
      descricao: string;
    };
    observacao: string;
    tipo: $Enums.smartnewsystem_financeiro_emissao_tributos_tipo;
  };
  listByPayment: {
    id: number;
    valor: number;
    taxation: {
      id: number;
      descricao: string;
    };
    observacao: string;
    tipo: $Enums.smartnewsystem_financeiro_emissao_tributos_tipo;
  };
}
