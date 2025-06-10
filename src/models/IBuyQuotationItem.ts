import { $Enums } from '@prisma/client';

export default interface IBuyQuotationItem {
  listByBuyAndSelect: {
    id: number;
    quantidade: number;
    valor: number;
    item: {
      id: number;
      compositionItem: {
        id: number;
      };
    };
  };
  findById: {
    id: number;
    quantidade: number;
    valor: number;
    item: {
      id: number;
      vinculo: $Enums.smartnewsystem_compras_item_solicitacao_vinculo;
      quantidade: number;
      equipment: {
        ID: number;
        equipamento_codigo: string;
        descricao: string;
      } | null;
      serviceOrder: {
        ID: number;
        ordem: string;
        equipment: {
          ID: number;
          equipamento_codigo: string;
          descricao: string;
        };
      } | null;
      material: {
        id: number;
        material: string;
        tipo: string;
      };
      materialSecond: {
        id: number;
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
            centro_custo: string;
            descricao: string;
            descriptionCostCenter: {
              id: number;
              descricao_centro_custo: string;
            };
          };
        };
      };
    };
    quotation: {
      id: number;
      provider: {
        ID: number;
        nome_fantasia: string;
      };
    };
  };
}
