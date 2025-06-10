import { $Enums } from '@prisma/client';

export default interface IBuyItem {
  listByBuy: {
    id: number;
    sequencia: number;
    quantidade: number;
    vinculo: $Enums.smartnewsystem_compras_item_solicitacao_vinculo;
    observacao: string;
    estoque: number;
    material: {
      id: number;
      material: string;
      codigo: string;
      unidade: string;
      codigo_auxiliar: string | null;
      codigo_ncm: number | null;
      codigo_secundario: string | null;
      categoryMaterial: {
        id: number;
        departmentCategory: {
          id: number;
        }[];
      };
    };
    materialSecond: {
      id: number;
      codigo: string;
      marca: string | null;
      classificacao: number | null;
    } | null;
    equipment: {
      descricao: string;
      ID: number;
      equipamento_codigo: string;
    } | null;
    serviceOrder: {
      equipment: {
        descricao: string;
        ID: number;
        equipamento_codigo: string;
      };
      ID: number;
      ordem: string;
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
          descricao: string;
          ID: number;
          centro_custo: string;
        };
      };
    };
    priority: {
      id: number;
      name: string;
      prazo: number;
    };
    quotationItem: {
      id: number;
      quantidade: number;
      valor: number;
      observacao: string;
    }[];
    quoteReason: {
      id: number;
      id_fornecedor: number;
      bloquear: number;
    }[];
    materialStock: {
      id: number;
      log_user: string;
      status: number;
      stockWithdrawal: {
        id: number;
        status: number;
        responsavel: string;
        log_date: Date;
      }[];
    }[];
  };
  listByBuyAndNotStock: {
    id: number;
    sequencia: number;
    quantidade: number;
    vinculo: $Enums.smartnewsystem_compras_item_solicitacao_vinculo;
    observacao: string;
    material: {
      id: number;
      material: string;
      codigo: string;
      unidade: string;
      codigo_auxiliar: string | null;
      codigo_ncm: number | null;
      codigo_secundario: string | null;
      categoryMaterial: {
        id: number;
        departmentCategory: {
          id: number;
        }[];
      };
    };
    materialSecond: {
      id: number;
      codigo: string;
      classificacao: number;
      marca: string;
    } | null;
    equipment: {
      descricao: string;
      ID: number;
      equipamento_codigo: string;
    } | null;
    serviceOrder: {
      equipment: {
        descricao: string;
        ID: number;
        equipamento_codigo: string;
      };
      ID: number;
      ordem: string;
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
          descricao: string;
          ID: number;
          centro_custo: string;
        };
      };
    };
    priority: {
      id: number;
      name: string;
      prazo: number;
    };
    quotationItem: {
      id: number;
      quantidade: number;
      valor: number;
      observacao: string;
    }[];
    quoteReason: {
      id: number;
      id_fornecedor: number;
      bloquear: number;
    }[];
  };
  listByBuyAndStock: {
    id: number;
    sequencia: number;
    quantidade: number;
    vinculo: $Enums.smartnewsystem_compras_item_solicitacao_vinculo;
    observacao: string;
    material: {
      id: number;
      material: string;
      codigo: string;
      unidade: string;
      codigo_auxiliar: string | null;
      codigo_ncm: number | null;
      codigo_secundario: string | null;
      categoryMaterial: {
        id: number;
        departmentCategory: {
          id: number;
        }[];
      };
    };
    materialSecond: {
      id: number;
      codigo: string;
      classificacao: number;
      marca: string;
    } | null;
    equipment: {
      descricao: string;
      ID: number;
      equipamento_codigo: string;
    } | null;
    serviceOrder: {
      equipment: {
        descricao: string;
        ID: number;
        equipamento_codigo: string;
      };
      ID: number;
      ordem: string;
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
          descricao: string;
          ID: number;
          centro_custo: string;
        };
      };
    };
    priority: {
      id: number;
      name: string;
      prazo: number;
    };
    quotationItem: {
      id: number;
      quantidade: number;
      valor: number;
      observacao: string;
    }[];
    quoteReason: {
      id: number;
      id_fornecedor: number;
      bloquear: number;
    }[];
  };
}
