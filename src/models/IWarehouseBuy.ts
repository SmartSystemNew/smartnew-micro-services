export default interface IWarehouseBuy {
  findById: {
    id: number;
    id_cliente: number;
    id_filial: number;
    id_material: number;
    id_item: number;
    id_material_secundario: number;
    quantidade: number;
    id_compra: number;
    log_user: string | null;
    log_date: Date;
    status: number | null;
    retirada: number | null;
    buy: {
      id: number;
      numero: number;
      branch: {
        filial_numero: string;
      };
    };
    material: {
      id: number;
      material: string;
      unidade: string;
      codigo_secundario: string;
      codigo_ncm: number;
    };
    itemBuy: {
      id: number;
      estoque: number;
      quantidade: number;
      compositionItem: {
        composicao: string;
        descricao: string;
        compositionGroup: {
          composicao: string;
          descricao: string;
          costCenter: {
            centro_custo: string;
            descricao: string;
          };
        };
      };
    };
    itemMaterial: {
      id: number;
      serviceOrder: {
        ID: number;
        ordem: string;
      };
    } | null;
    stockWithdrawal: {
      id: number;
      responsavel: string;
      url: string;
      log_date: Date;
    }[];
    materialCodigo: {
      classificacao: number;
      codigo: string;
      especificacao: string;
      marca: string;
    };
  };
  findByBuyAndItem: {
    id: number;
    id_cliente: number;
    id_filial: number;
    id_material: number;
    id_item: number;
    id_material_secundario: number;
    quantidade: number;
    id_compra: number;
    log_user: string | null;
    log_date: Date;
    status: number | null;
    retirada: number | null;
    buy: {
      numero: number;
      branch: {
        filial_numero: string;
      };
    };
    material: {
      id: number;
      material: string;
      unidade: string;
      codigo_secundario: string;
      codigo_ncm: number;
    };
    itemBuy: {
      id: number;
      estoque: number;
      quantidade: number;
      compositionItem: {
        composicao: string;
        descricao: string;
        compositionGroup: {
          composicao: string;
          descricao: string;
          costCenter: {
            centro_custo: string;
            descricao: string;
          };
        };
      };
    };
    stockWithdrawal: {
      id: number;
      responsavel: string;
      url: string;
      log_date: Date;
    }[];
    materialCodigo: {
      classificacao: number;
      codigo: string;
      especificacao: string;
      marca: string;
    };
  };
  findOne: {
    id: number;
    status: number;
    id_item_material_servico: number | null;
    buy: {
      id: number;
      status: number;
      item: {
        id: number;
        estoque: number;
      }[];
    };
  };
  listMaterial: {
    id: number;
    id_cliente: number;
    id_filial: number;
    id_material: number;
    id_item: number;
    id_material_secundario: number;
    quantidade: number;
    id_compra: number;
    log_user: string | null;
    log_date: Date;
    status: number | null;
    retirada: number | null;
    buy: {
      numero: number;
      branch: {
        ID: number;
        filial_numero: string;
      };
    };
    material: {
      id: number;
      material: string;
      unidade: string;
      codigo_secundario: string;
      codigo_ncm: number;
    };
    itemBuy: {
      estoque: number;
      quantidade: number;
      compositionItem: {
        composicao: string;
        descricao: string;
        compositionGroup: {
          composicao: string;
          descricao: string;
          costCenter: {
            centro_custo: string;
            descricao: string;
          };
        };
      };
    };
    stockWithdrawal: {
      id: number;
      responsavel: string;
      url: string;
      log_date: Date;
    }[];
    materialCodigo: {
      id: number;
      classificacao: number;
      codigo: string;
      especificacao: string;
      marca: string;
    };
  };
  listWithDrawal: {
    id: number;
    id_cliente: number;
    id_filial: number;
    id_material: number;
    id_item: number;
    id_material_secundario: number;
    quantidade: number;
    id_compra: number;
    log_user: string | null;
    log_date: Date;
    status: number | null;
    retirada: number | null;
    buy: {
      numero: number;
      branch: {
        filial_numero: string;
      };
    };
    material: {
      material: string;
      unidade: string;
      codigo_secundario: string;
      codigo_ncm: number;
    };
    itemBuy: {
      estoque: number;
      quantidade: number;
      compositionItem: {
        composicao: string;
        descricao: string;
        compositionGroup: {
          composicao: string;
          descricao: string;
          costCenter: {
            centro_custo: string;
            descricao: string;
          };
        };
      };
    };
    stockWithdrawal: {
      id: number;
      responsavel: string;
      url: string;
      observacao: string | null;
      log_date: Date;
    }[];
    materialCodigo: {
      id: number;
      classificacao: number;
      codigo: string;
      especificacao: string;
      marca: string;
    };
  };
  groupByMaterialSecondApproved: {
    id: number;
    quantidade: number;
  };
}
