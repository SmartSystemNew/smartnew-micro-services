import { $Enums } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export default interface IBuyRequest {
  listTable: {
    id: number;
    numero: number;
    buy: {
      id: number;
      numero: number;
      observacao: string;
      fechamento: Date;
      branch: {
        ID: number;
        filial_numero: string;
      };
      userResponsible: {
        login: string;
        name: string;
      };
      buyQuotationDiscount: {
        id: number;
        provider: {
          ID: number;
          nome_fantasia: string;
        };
        tipo: $Enums.smartnewsystem_financeiro_registro_tributo_tipo;
        valor: number;
      }[];
      conditionAnswer: {
        id: number;
        resposta: string | null;
        condition: {
          id: number;
          condicao: string;
        };
        provider: {
          ID: number;
          nome_fantasia: string;
        };
      }[];
      buyPreFinance: {
        id: number;
        buyPreFinancePayment: {
          id: number;
          vencimento: Date;
          paymentType: {
            id: number;
            descricao: string;
          };
          provider: {
            ID: number;
            nome_fantasia: string;
          };
        }[];
      }[];
    };
    provider: {
      ID: number;
      nome_fantasia: string;
      cnpj: string;
    };
    requestProvider: {
      id: number;
      provider: {
        ID: number;
        nome_fantasia: string;
      };
      finance: {
        id: number;
        numero_fiscal: string;
      };
    }[];
    requestItem: {
      id: number;
      status: {
        id: number;
        status: string;
        icone: string;
      };
      quotationItem: {
        id: number;
        quantidade: number;
        valor: number;
      };
    }[];
  };
  findById: {
    id: number;
    numero: number;
    numero_fiscal: string | null;
    chave: string | null;
    data_emissao: Date | null;
    typeDocument: {
      id: number;
      descricao: string;
    } | null;
    buy: {
      id: number;
      numero: number;
      observacao: string;
      fechamento: Date;
      branch: {
        ID: number;
        filial_numero: string;
      };
      userResponsible: {
        login: string;
        name: string;
      };
      buyQuotationDiscount: {
        id: number;
        provider: {
          ID: number;
          nome_fantasia: string;
        };
        tipo: $Enums.smartnewsystem_financeiro_registro_tributo_tipo;
        valor: number;
      }[];
      conditionAnswer: {
        id: number;
        resposta: string | null;
        condition: {
          id: number;
          condicao: string;
        };
        provider: {
          ID: number;
          nome_fantasia: string;
        };
      }[];
      buyPreFinance: {
        id: number;
        buyPreFinancePayment: {
          id: number;
          vencimento: Date;
          quantidade_parcela: number;
          frequencia: number;
          frequencia_fixa: number;
          parcelar: number;
          paymentType: {
            id: number;
            descricao: string;
          };
          provider: {
            ID: number;
            nome_fantasia: string;
          };
        }[];
      }[];
    };
    provider: {
      ID: number;
      nome_fantasia: string;
      cnpj: string;
    };
    requestProvider: {
      id: number;
      provider: {
        ID: number;
        nome_fantasia: string;
      };
      finance: {
        id: number;
        numero_fiscal: string;
        chave: string;
        data_emissao: Date;
        quantidade_parcela: number;
        frequencia_pagamento: number;
        frequencia_fixa: number;
        parcelar: number;
        data_vencimento: Date | null;
        paymentType: {
          id: number;
          descricao: string;
        } | null;
        documentType: {
          id: number;
          descricao: string;
        };
        items: {
          id: number;
          quantidade: Decimal;
          preco_unitario: Decimal;
          compositionItem: {
            id: number;
            composicao: string;
            descricao: string;
          };
          material: {
            id: number;
            material: string;
          };
        }[];
      };
    }[];
    requestItem: {
      id: number;
      status: {
        id: number;
        status: string;
        icone: string;
        finaliza: number;
      };
      quotationItem: {
        id: number;
        quantidade: number;
        valor: number;
      };
    }[];
  };
  listByBuy: {
    id: number;
    numero: number;
    numero_fiscal: string | null;
    chave: string | null;
    data_emissao: Date | null;
    typeDocument: {
      id: number;
      descricao: string;
    } | null;
    buy: {
      id: number;
      numero: number;
      observacao: string;
      fechamento: Date;
      branch: {
        ID: number;
        filial_numero: string;
      };
      userResponsible: {
        login: string;
        name: string;
      };
      buyQuotationDiscount: {
        id: number;
        provider: {
          ID: number;
          nome_fantasia: string;
        };
        tipo: $Enums.smartnewsystem_financeiro_registro_tributo_tipo;
        valor: number;
      }[];
      conditionAnswer: {
        id: number;
        resposta: string | null;
        condition: {
          id: number;
          condicao: string;
        };
        provider: {
          ID: number;
          nome_fantasia: string;
        };
      }[];
      buyPreFinance: {
        id: number;
        buyPreFinancePayment: {
          id: number;
          vencimento: Date;
          paymentType: {
            id: number;
            descricao: string;
          };
          provider: {
            ID: number;
            nome_fantasia: string;
          };
        }[];
      }[];
    };
    provider: {
      ID: number;
      nome_fantasia: string;
      cnpj: string;
    };
    requestProvider: {
      id: number;
      provider: {
        ID: number;
        nome_fantasia: string;
      };
      finance: {
        id: number;
        numero_fiscal: string;
        chave: string;
        data_emissao: Date;
        documentType: {
          id: number;
          descricao: string;
        };
        items: {
          id: number;
          quantidade: Decimal;
          preco_unitario: Decimal;
          compositionItem: {
            id: number;
            composicao: string;
            descricao: string;
          };
          material: {
            id: number;
            material: string;
          };
        }[];
      };
    }[];
    requestItem: {
      id: number;
      status: {
        id: number;
        status: string;
        icone: string;
        finaliza: number;
      };
      quotationItem: {
        id: number;
        quantidade: number;
        valor: number;
      };
    }[];
  };
}
