import { $Enums } from '@prisma/client';

export default interface IBuyQuotationSelected {
  listByBuy: {
    id: number;
    aprovado: number;
    buy: {
      id: number;
      numero: number;
    };
    quotationItem: {
      id: number;
      observacao: string;
      quotation: {
        id: number;
        provider: {
          ID: number;
          nome_fantasia: string;
        };
      };
      item: {
        id: number;
        sequencia: number;
        quantidade: number;
        vinculo: $Enums.smartnewsystem_compras_item_solicitacao_vinculo;
        compositionItem: {
          id: number;
          composicao: string;
          descricao: string;
        };
        material: {
          id: number;
          material: string;
        };
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
      };
      quantidade: number;
      valor: number;
    };
  };
}
