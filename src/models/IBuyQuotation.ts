import { $Enums } from '@prisma/client';

export default interface IBuyQuotation {
  findById: {
    id: number;
    user: {
      name: string;
      login: string;
    };
    buy: {
      id: number;
      numero: number;
      buyStatus: {
        id: number;
        descricao: string;
      };
    };
    userClose: {
      name: string;
      login: string;
    };
    quotationItem: {
      id: number;
      quantidade: number;
      observacao: string;
      item: {
        id: number;
        quantidade: number;
        material: {
          id: number;
          material: string;
        };
      };
      valor: number;
    }[];
    provider: {
      ID: number;
      nome_fantasia: string;
    };
  };
  listByBuy: {
    id: number;
    comentario: string | null;
    user: {
      name: string;
      login: string;
    };
    buy: {
      id: number;
      numero: number;
      branch: {
        ID: number;
        filial_numero: string;
      };
      item: {
        id: number;
        estoque: number | null;
      }[];
      buyStatus: {
        id: number;
        descricao: string;
      };
      buyQuotationDiscount: {
        id: number;
        provider: {
          ID: number;
          nome_fantasia: string;
        };
        valor: number;
        tipo: $Enums.smartnewsystem_financeiro_registro_tributo_tipo;
      }[];
    };
    userClose: {
      name: string;
      login: string;
    };
    quotationItem: {
      id: number;
      quantidade: number;
      observacao: string;
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
          codigo: string;
          material: string;
        };
        materialSecond: {
          id: number;
          codigo: string | null;
          especificacao: string | null;
          marca: string | null;
        } | null;
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
      valor: number;
    }[];
    provider: {
      ID: number;
      nome_fantasia: string;
    };
  };
  listByProvider: {
    id: number;
    user: {
      name: string;
      login: string;
    };
    buy: {
      id: number;
      numero: number;
      buyStatus: {
        id: number;
        descricao: string;
      };
    };
    userClose: {
      name: string;
      login: string;
    };
    quotationItem: {
      id: number;
      quantidade: number;
      observacao: string;
      item: {
        id: number;
        quantidade: number;
        material: {
          id: number;
          material: string;
        };
      };
      valor: number;
    }[];
    provider: {
      ID: number;
      nome_fantasia: string;
    };
  };
  findByBuyAndProvider: {
    id: number;
    user: {
      name: string;
      login: string;
    };
    buy: {
      id: number;
      numero: number;
      buyStatus: {
        id: number;
        descricao: string;
      };
    };
    userClose: {
      name: string;
      login: string;
    };
    quotationItem: {
      id: number;
      quantidade: number;
      observacao: string;
      item: {
        id: number;
        quantidade: number;
        material: {
          id: number;
          material: string;
        };
      };
      valor: number;
    }[];
    provider: {
      ID: number;
      nome_fantasia: string;
    };
  };
}
