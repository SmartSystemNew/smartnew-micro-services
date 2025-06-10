import { $Enums } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface IFinanceItem {
  insert: IFindByTitle;
}

export interface IAggregateByTitle {
  _sum: {
    total: Decimal | number;
  };
}

export interface IListFinanceByCostCenterAndDirection {
  finance: {
    id: number;
  };
}

export interface IFindByTitle {
  total: Decimal;
  id: number;
  item: string;
  vinculo: $Enums.smartnewsystem_financeiro_titulos_dados_vinculo;
  quantidade: Decimal;
  preco_unitario: Decimal;
  id_equipamento: number | null;
  id_os: number | null;
  id_insumo: number | null;
  id_material: number | null;
  order: {
    equipment: {
      ID: number;
      descricao: string;
      equipamento_codigo: string;
    };
    ordem: string;
    ID: number;
  } | null;
  equipment: {
    ID: number;
    descricao: string;
    equipamento_codigo: string;
  } | null;
  finance: {
    id: number;
    direcao: 'pagar' | 'receber';
    numero_fiscal: string;
    financeControl: {
      issuePay: {
        nome_fantasia: string;
      };
      senderReceive: {
        nome_fantasia: string;
      };
    };
  };
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
        centro_custo: string | null;
        descricao: string | null;
        descriptionCostCenter: {
          id: number;
          descricao_centro_custo: string | null;
          branch: {
            ID: number;
            filial_numero: string | null;
          };
        };
      };
    };
  };
  material: {
    id: number;
    material: string;
  } | null;
  input: {
    id: number;
    insumo: string;
  } | null;
  financeBound: {
    order: {
      equipment: {
        ID: number;
        descricao: string;
        equipamento_codigo: string;
      };
      ordem: string;
      ID: number;
    } | null;
    equipment: {
      ID: number;
      descricao: string;
      equipamento_codigo: string;
    } | null;
  }[];
}
