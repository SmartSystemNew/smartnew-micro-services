import { $Enums } from '@prisma/client';

export interface IFinanceRegisterTribute {
  findByFinance: {
    id: number;
    valor: number;
    descricao: string;
    tipo: $Enums.smartnewsystem_financeiro_registro_tributo_tipo;
    tribute: {
      id: number;
      descricao: string;
    };
  };
  findById: {
    id: number;
    valor: number;
    descricao: string;
    tipo: $Enums.smartnewsystem_financeiro_registro_tributo_tipo;
    tribute: {
      id: number;
      descricao: string;
    };
  };
}
