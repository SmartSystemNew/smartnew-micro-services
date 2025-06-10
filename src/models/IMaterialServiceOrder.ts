import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface IMaterialServiceOrder {
  findById: {
    id: number;
    id_filial?: number | null;
    categoria?: number | null;
    codigo?: string | null;
    quantidade?: Prisma.Decimal | null;
    unidade?: string | null;
    valor_unidade?: Prisma.Decimal | null;
    valor_total?: Prisma.Decimal | null;
    utilizado: string | null;
    observacao?: string | null;
    data_uso?: Date | null;
    n_serie_antigo?: string | null;
    n_serie_novo?: string | null;
    log_date: Date;
    log_user?: string | null;
    sessao_id?: string | null;
    id_equipamento?: number | null;
    id_codigo?: number | null;
    equipment: {
      ID: number;
      equipamento_codigo: string;
    };
    material?: number | null;
    materials: {
      id: number;
      codigo: string;
      material: string;
    };
    materialCodigo: {
      id: number;
      codigo: string;
    } | null;
    id_cliente: number;
    company: {
      ID: number;
      razao_social: string;
    };
    id_ordem_servico?: number | null;
    serviceOrder: {
      ID: number;
      ordem: string;
    };
    id_tarefa_plano?: number | null;
    planPrev: {
      ID: number;
      unidade_dia: string;
    };
    id_programacao_r2?: number | null;
    maintenancePlanTask: {
      id: number;
      unidade: string;
    };
    buyItem: {
      id: number;
      buy: {
        id: number;
        id_filial: number;
        status: number;
      };
    }[];
  };
  listByServiceOrder: {
    id: number;
    id_filial?: number | null;
    categoria?: number | null;
    codigo?: string | null;
    quantidade?: Prisma.Decimal | null;
    unidade?: string | null;
    valor_unidade?: Prisma.Decimal | null;
    valor_total?: Prisma.Decimal | null;
    utilizado: string;
    observacao?: string | null;
    data_uso?: Date | null;
    n_serie_antigo?: string | null;
    n_serie_novo?: string | null;
    log_date: Date;
    log_user?: string | null;
    sessao_id?: string | null;
    id_equipamento?: number | null;
    id_codigo?: number | null;
    equipment: {
      ID: number;
      equipamento_codigo: string;
    };
    material?: number | null;
    materials: {
      id: number;
      codigo: string;
      material: string;
    };
    materialCodigo: {
      id: number;
      codigo: string;
      marca: string | null;
      classificacao: number | null;
    } | null;
    id_cliente: number;
    company: {
      ID: number;
      razao_social: string;
    };
    id_ordem_servico?: number | null;
    serviceOrder: {
      ID: number;
      ordem: string;
    };
    id_tarefa_plano?: number | null;
    planPrev: {
      ID: number;
      unidade_dia: string;
    };
    id_programacao_r2?: number | null;
    maintenancePlanTask: {
      id: number;
      unidade: string;
    };
    buyItem: {
      id: number;
      buy: {
        id: number;
        numero: number;
      };
    }[];
    materialStock: {
      id: number;
      stockWithdrawal: {
        id: number;
        log_date: Date | null;
      }[];
    }[];
  };

  listByMaterialOrderService: {
    id: number;
    id_ordem_servico: number;
    material: number;
    quantidade: Decimal;
    valor_unidade: Decimal;
    data_uso: Date;
    n_serie_novo: string;
    n_serie_antigo: string;
  };

  createMaterialOrder: {
    id: number;
    id_ordem_servico: number;
    material: number;
    quantidade: Decimal;
    valor_unidade: Decimal;
    data_uso: Date;
    n_serie_novo: string;
    n_serie_antigo: string;
  };
}
