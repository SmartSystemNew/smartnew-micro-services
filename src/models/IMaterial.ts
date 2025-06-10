import { $Enums, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface IMaterial {
  listStock: {
    id: number;
    codigo: string;
    material: string;
    unidade: string;
    descricao: string;
    entrada: number;
    saida: number;
    estoque_max: number;
    estoque_min: number;
    ultima_entrada: number;
    ultima_saida: number;
  };
  listStockCodeSecond: {
    id: number;
    codigo: string;
    material: string;
    marca: string;
    classificacao: number;
    especificacao: string;
    unidade: string;
    descricao: string;
    entrada: number;
    saida: number;
    reserva: number;
    estoque_max: number;
    estoque_min: number;
    ultima_entrada: number;
    ultima_saida: number;
  };
  listStockCodeSecondInPage: {
    id: number;
    codigo: string;
    material: string;
    marca: string;
    classificacao: number;
    especificacao: string;
    unidade: string;
    descricao: string;
    entrada: number;
    saida: number;
    reserva: number;
    estoque_max: number;
    estoque_min: number;
    ultima_entrada: number;
    ultima_saida: number;
  };
  findById: {
    id: number;
    id_filial: number;
    codigo?: string;
    material: string;
    unidade: string;
    ativo: number;
    valor: Prisma.Decimal;
    Valor_venda: Prisma.Decimal;
    fator: Prisma.Decimal;
    estoque_min?: Prisma.Decimal;
    estoque_max?: Prisma.Decimal;
    estoque_real: Prisma.Decimal;
    localizacao?: string;
    log_date: Date;
    log_user?: string;
    sessao_id?: string;
    DataEstoqueMin?: Date;
    id_categoria?: number;
    categoryMaterial: {
      id: number;
      descricao: string;
    };
    id_cliente: number;
    company: {
      ID: number;
      razao_social: string;
    };
    materialSectorExecutorIn?: {
      Id: number;
      observacao: string;
    }[];
    stockIn?: {
      id: number;
      numero_serie: string;
    }[];
    stockMovement?: {
      Id: number;
      descricao_vinculo: string;
    }[];
    materialSuppliers?: {
      id: number;
      observacoes: string;
    }[];
    materialServiceOrder?: {
      id: number;
      codigo: string;
    }[];
    materialPlanPrev?: {
      id: number;
      material: number;
    }[];
    materialProject?: {
      id: number;
      observacao: string;
    }[];
    purchaseItemRequest?: {
      id: number;
      observacao: string;
    }[];
    itemForMaterial?: {
      id: number;
      item: string;
    }[];
  };
  findMaterialAndBound: {
    id: number;
    material: string;
    materialSuppliers: {
      id: number;
    }[];
    materialServiceOrder: {
      id: number;
    }[];
    materialPlanPrev: {
      id: number;
    }[];
    itemForMaterial: {
      id: number;
    }[];
  };
  listByClient: {
    id: number;
    id_cliente: number;
    id_filial: number;
    codigo?: string;
    material: string;
    unidade: string | null;
    ativo: number;
    valor: Prisma.Decimal;
    Valor_venda: Prisma.Decimal;
    fator: Prisma.Decimal;
    estoque_min?: Prisma.Decimal;
    estoque_max?: Prisma.Decimal;
    estoque_real: Prisma.Decimal;
    localizacao?: string;
    log_date: Date;
    log_user?: string;
    sessao_id?: string;
    //DataEstoqueMin?: Date;
    id_categoria?: number;
    codigo_ncm: number;
    codigo_secundario: string;
    tipo: $Enums.sofman_cad_materiais_tipo;
    observacao: string;
    categoryMaterial: {
      id: number;
      descricao: string;
    };
    company: {
      ID: number;
      razao_social: string;
    };
    branch: {
      ID: number;
      razao_social: string;
    } | null;
    // materialSectorExecutorIn?: {
    //   Id: number;
    //   observacao: string;
    // }[];
    // stockIn?: {
    //   id: number;
    //   numero_serie: string;
    // }[];
    // stockMovement?: {
    //   Id: number;
    //   descricao_vinculo: string;
    // }[];
    // materialSuppliers?: {
    //   id: number;
    //   observacoes: string;
    // }[];
    // materialServiceOrder?: {
    //   id: number;
    //   codigo: string;
    // }[];
    // materialPlanPrev?: {
    //   id: number;
    //   material: number;
    // }[];
    // materialProject?: {
    //   id: number;
    //   observacao: string;
    // }[];
    // purchaseItemRequest?: {
    //   id: number;
    //   observacao: string;
    // }[];
    // itemForMaterial?: {
    //   id: number;
    //   item: string;
    // }[];
  };
  listForReportStockByClient: {
    id: number;
    id_cliente: number;
    id_filial: number;
    codigo?: string;
    codigo_secundario?: string;
    material: string;
    unidade: string | null;
    ativo: number;
    valor: Prisma.Decimal;
    Valor_venda: Prisma.Decimal;
    fator: Prisma.Decimal;
    estoque_min?: Prisma.Decimal;
    estoque_max?: Prisma.Decimal;
    estoque_real: Prisma.Decimal;
    localizacao?: string;
    log_date: Date;
    log_user?: string;
    sessao_id?: string;
    DataEstoqueMin?: Date;
    id_categoria?: number;
    categoryMaterial: {
      id: number;
      descricao: string;
    };
    company: {
      ID: number;
      razao_social: string;
    };
    stockIn?: {
      id: number;
      numero_serie: string;
      quantidade: Decimal;
      data_entrada: Date | null;
      valor_unitario: Decimal;
    }[];
    materialServiceOrder?: {
      id: number;
      codigo: string;
      data_uso: Date | null;
      valor_unidade: Decimal;
      quantidade: Decimal;
      serviceOrder: {
        ID: number;
        ordem: string;
        statusOrderService: {
          id: number;
          status: string;
          cor: string;
        };
      };
    }[];
    // purchaseItemRequest?: {
    //   id: number;
    //   observacao: string;
    // }[];
    // itemForMaterial?: {
    //   id: number;
    //   item: string;
    // }[];
  };
  listByClientAndActive: {
    id: number;
    codigo: string;
    material: string;
    unidade: string | null;
    id_categoria?: number;
    tipo?: $Enums.sofman_cad_materiais_tipo;
    id_cliente: number;
    localizacao: string;
    log_user: string;
    ativo: number;
    observacao: string;
    codigo_ncm: number;
    categoryMaterial: {
      id: number;
      descricao: string;
    };
    company: {
      ID: number;
      razao_social: string;
    };
    branch: {
      ID: number;
      razao_social: string;
    } | null;
    location: {
      id: number;
      localizacao: string;
    } | null;
  };
  listById: {
    id: number;
    codigo: string;
    material: string;
    unidade: string | null;
    id_categoria?: number;
    id_cliente: number;
    localizacao: string;
    observacao: string;
    ativo: number;
    estoque_min: Decimal;
    estoque_max: Decimal;
    tipo: $Enums.sofman_cad_materiais_tipo;
    codigo_ncm: number;
    codigo_secundario: string;
    categoryMaterial: {
      id: number;
      descricao: string;
    };
    company: {
      ID: number;
      razao_social: string;
    };
    branch: {
      ID: number;
      razao_social: string;
    } | null;
    materialSectorExecutorIn?: {
      Id: number;
      observacao: string;
    }[];
    stockIn?: {
      id: number;
      numero_serie: string;
      quantidade: Decimal;
      valor_unitario: Decimal;
    }[];
    stockMovement?: {
      Id: number;
      descricao_vinculo: string;
    }[];
    materialServiceOrder?: {
      id: number;
      codigo: string;
      quantidade: Decimal;
      valor_unidade: Decimal;
    }[];
    materialPlanPrev?: {
      id: number;
      material: number;
    }[];
    materialProject?: {
      id: number;
      observacao: string;
    }[];
    purchaseItemRequest?: {
      id: number;
      observacao: string;
    }[];
    itemForMaterial?: {
      id: number;
      item: string;
    }[];
    materialCode: {
      id: number;
      codigo: string;
      marca: string | null;
      especificacao: string | null;
      classificacao: number | null;
      estoque_min: Decimal | null;
      estoque_max: Decimal | null;
    }[];
  };
  groupStockByPrice: {
    price: number;
    quantity: number;
  };
  findByClientAndMaterial: {
    id: number;
    codigo: string;
    material: string;
    unidade: string | null;
    id_categoria?: number;
    categoryMaterial: {
      id: number;
      descricao: string;
    };
    id_cliente: number;
    company: {
      ID: number;
      razao_social: string;
    };
    materialSectorExecutorIn?: {
      Id: number;
      observacao: string;
    }[];
    stockIn?: {
      id: number;
      numero_serie: string;
    }[];
    stockMovement?: {
      Id: number;
      descricao_vinculo: string;
    }[];
    materialSuppliers?: {
      id: number;
      observacoes: string;
    }[];
    materialServiceOrder?: {
      id: number;
      codigo: string;
    }[];
    materialPlanPrev?: {
      id: number;
      material: number;
    }[];
    materialProject?: {
      id: number;
      observacao: string;
    }[];
    purchaseItemRequest?: {
      id: number;
      observacao: string;
    }[];
    itemForMaterial?: {
      id: number;
      item: string;
    }[];
  };
}
