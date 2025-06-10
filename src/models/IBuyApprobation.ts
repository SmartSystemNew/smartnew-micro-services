import { $Enums } from '@prisma/client';

export default interface IBuyApprobation {
  findById: {
    id: number;
    aprovado: number;
    log_date: Date;
    buy: {
      id: number;
      numero: number;
      fechamento: Date | null;
      observacao: string | null;
      quotationSelected: {
        id: number;
        quotationItem: {
          id: number;
          quantidade: number;
          valor: number;
          item: {
            id: number;
            vinculo: $Enums.smartnewsystem_compras_item_solicitacao_vinculo;
            material: {
              id: number;
              material: string;
            };
            compositionItem: {
              id: number;
            };
            equipment: {
              ID: number;
            } | null;
            serviceOrder: {
              ID: number;
            } | null;
          };
          quotation: {
            id: number;
            provider: {
              ID: number;
              nome_fantasia: string;
            };
          };
        };
      }[];
      branch: {
        ID: number;
        filial_numero: string;
      };
      userResponsible: {
        login: string;
        name: string;
      };
      buyStatus: {
        id: number;
        descricao: string;
      };
      item: {
        id: number;
        estoque: number | null;
      }[];
    };
  };
  listByBuy: {
    id: number;
    aprovado: number;
    log_date: Date;
    buy: {
      id: number;
      numero: number;
      fechamento: Date | null;
      observacao: string | null;
      quotationSelected: {
        id: number;
        quotationItem: {
          id: number;
          quantidade: number;
          valor: number;
          quotation: {
            id: number;
            provider: {
              ID: number;
              nome_fantasia: string;
            };
          };
        };
      }[];
      branch: {
        ID: number;
        filial_numero: string;
      };
      userResponsible: {
        login: string;
        name: string;
      };
      buyStatus: {
        id: number;
        descricao: string;
      };
    };
  };
  listByBranches: {
    id: number;
    aprovado: number;
    log_date: Date;
    buy: {
      id: number;
      numero: number;
      fechamento: Date | null;
      observacao: string | null;
      quotationSelected: {
        id: number;
        quotationItem: {
          id: number;
          quantidade: number;
          valor: number;
        };
      }[];
      branch: {
        ID: number;
        filial_numero: string;
      };
      userResponsible: {
        login: string;
        name: string;
      };
      buyStatus: {
        id: number;
        descricao: string;
      };
    };
  };
  listByBranchesAndLogin: {
    id: number;
    aprovado: number;
    log_date: Date;
    user: {
      login: string;
      elevation: {
        id: number;
        id_filial: number;
        nivel: number;
      }[];
    };
    buy: {
      id: number;
      numero: number;
      fechamento: Date | null;
      observacao: string | null;
      quotationSelected: {
        id: number;
        quotationItem: {
          id: number;
          quantidade: number;
          valor: number;
        };
      }[];
      branch: {
        ID: number;
        filial_numero: string;
      };
      userResponsible: {
        login: string;
        name: string;
      };
      buyStatus: {
        id: number;
        descricao: string;
      };
    };
  };
  listByBranchesLastNivel: {
    id: number;
    aprovado: number;
    log_date: Date;
    buy: {
      id: number;
      numero: number;
      fechamento: Date | null;
      observacao: string | null;
      quotationSelected: {
        id: number;
        quotationItem: {
          id: number;
          quantidade: number;
          valor: number;
        };
      }[];
      branch: {
        ID: number;
        filial_numero: string;
      };
      userResponsible: {
        login: string;
        name: string;
      };
      buyStatus: {
        id: number;
        descricao: string;
      };
    };
  };
}
