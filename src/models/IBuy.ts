import { $Enums } from '@prisma/client';

export default interface IBuy {
  listByClientAndFilterRaw: {
    id: number;
    numero: string;
    observacao: string;
    log_date: Date;
    quantity_itens: number;
    total: number;
    branch: {
      ID: number;
      filial_numero: string;
    };
    buyStatus: {
      id: number;
      descricao: string;
    };
    user: {
      login: string;
      name: string;
    } | null;
    priority: {
      id: number | null;
      name: string | null;
    } | null;
    logBuy: {
      log_date: Date | null;
    }[];
  };
  listByClientAndFilterGrid: {
    id: number;
    numero: number;
    observacao: string;
    log_date: Date;
    branch: {
      ID: number;
      filial_numero: string;
    };
    buyStatus: {
      id: number;
      descricao: string;
    };
    user: {
      login: string | null;
      name: string | null;
    } | null;
    logBuy: {
      id: number;
      log_date: Date;
    }[];
  };
  listByClientAndFilter: {
    id: number;
    numero: number;
    observacao: string;
    log_date: Date;
    branch: {
      ID: number;
      filial_numero: string;
    };
    buyStatus: {
      id: number;
      descricao: string;
    };
    user: {
      login: string | null;
      name: string | null;
    } | null;
    logBuy: {
      id: number;
      log_date: Date;
    }[];
    item: {
      id: number;
      quotationItem: {
        quotationSelected: {
          id: number;
        }[];
        quantidade: number;
        valor: number;
      }[];
    }[];
  };
  createRequest: {
    error: boolean;
    success: boolean;
    message: string;
  };
  findById: {
    id: number;
    numero: number;
    observacao: string;
    status: number;
    log_date: Date;
    branch: {
      ID: number;
      filial_numero: string;
    };
    buyApprobation: {
      id: number;
      aprovado: number;
      user: {
        login: string;
        name: string;
      };
    }[];
    buyStatus: {
      id: number;
      descricao: string;
      icone: string;
    };
    item: {
      id: number;
      sequencia: number;
      estoque: number | null;
      quantidade: number;
      vinculo: $Enums.smartnewsystem_compras_item_solicitacao_vinculo;
      priority: {
        id: number;
        id_cliente: number;
        name: string;
        prazo: number;
        urgente: boolean;
        compra_direta: number | null;
        exige_fornecedor: number | null;
      };
      material: {
        id: number;
      };
      materialSecond: {
        id: number;
      } | null;
      compositionItem: {
        id: number;
        composicao: string;
        descricao: string;
      };
      equipment: {
        ID: number;
      } | null;
      materialOrder: {
        id: number;
      } | null;
      serviceOrder: {
        ID: number;
      } | null;
      quotationItem: {
        id: number;
        quantidade: number;
        quotationSelected: {
          id: number;
          aprovado: number;
        }[];
      }[];
    }[];
    user: {
      login: string;
      name: string;
    };
    userResponsible: {
      login: string;
      name: string;
    };
    buyQuotationDiscount: {
      id: number;
      valor: number;
      motivo: string;
      tipo: $Enums.smartnewsystem_financeiro_registro_tributo_tipo;
      provider: {
        ID: number;
        nome_fantasia: string;
      };
    }[];
    buyRelaunchOwn: {
      id: number;
      id_compra: number;
      novo_id_compra: number;
    }[];
  };
  listByBuyAndFinishProvider: {
    id: number;
    numero: number;
    observacao: string;
    status: number;
    log_date: Date;
    buyPreFinance: {
      id: number;
      buyPreFinancePayment: {
        id: number;
        vencimento: Date;
        quantidade_parcela: number;
        parcelar: number;
        frequencia: number;
        frequencia_fixa: number;
        paymentType: {
          id: number;
          descricao: string;
        };
      }[];
    }[];
    conditionAnswer: {
      id: number;
      provider: {
        ID: number;
        nome_fantasia: string;
      };
      resposta: string;
      condition: {
        id: number;
        condicao: string;
      };
    }[];
  };
  findByIdAndProviderQuotation: {
    id: number;
    numero: number;
    observacao: string;
    status: number;
    log_date: Date;
    branch: {
      ID: number;
      filial_numero: string;
    };
    buyApprobation: {
      id: number;
      aprovado: number;
      user: {
        login: string;
        name: string;
      };
    }[];
    buyStatus: {
      id: number;
      descricao: string;
      icone: string;
    };
    item: {
      id: number;
      quantidade: number;
      sequencia: number;
      observacao: string;
      material: {
        id: number;
        codigo: string;
        material: string;
      };
      materialSecond: {
        id: number;
        codigo: string;
        classificacao: number;
        marca: string;
      } | null;
      quotationItem: {
        id: number;
        valor: number;
        quantidade: number;
        observacao: string;
        quotationSelected: {
          id: number;
          aprovado: number;
        }[];
      }[];
    }[];
    user: {
      login: string;
      name: string;
    };
    userResponsible: {
      login: string;
      name: string;
    };
    buyQuotationDiscount: {
      id: number;
      valor: number;
      motivo: string;
      tipo: $Enums.smartnewsystem_financeiro_registro_tributo_tipo;
      provider: {
        ID: number;
        nome_fantasia: string;
      };
      tribute: {
        id: number;
        descricao: string;
      };
    }[];
  };
}
