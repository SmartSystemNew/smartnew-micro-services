import { Decimal } from '@prisma/client/runtime/library';

export default interface ITaskServiceOrder {
  listByClient: {
    id: number;
    status_exec: number | null;
    periodicidade_uso: Decimal | null;
    minutos: number | null;
    task: {
      id: number;
      tarefa: string;
    };
    taskPlanningMaintenance: {
      id: number;
      descriptionPlanMaintenance: {
        id: number;
        descricao: string;
      };
    };
    unity: {
      id: number;
      unidade: string;
    };
  };
  findById: {
    id: number;
    status_exec: number | null;
    periodicidade_uso: Decimal | null;
    minutos: number | null;
    serviceOrder: {
      ID: number;
      ordem: string;
    };
    task: {
      id: number;
      tarefa: string;
      tipo_dado: string | null;
      obrigatorio: number | null;
    };
    taskPlanningMaintenance: {
      id: number;
      descriptionPlanMaintenance: {
        id: number;
        descricao: string;
      };
    };
    unity: {
      id: number;
      unidade: string;
    };
    registerHour: {
      id: number;
      inicio: Date;
      fim: Date | null;
    }[];
  };
  findByWhere: {
    id: number;
    status_exec: number | null;
    periodicidade_uso: Decimal | null;
    minutos: number | null;
    serviceOrder: {
      ID: number;
      ordem: string;
    };
    planTask: {
      ID: number;
      planDescription: {
        id: number;
        descricao: string;
      };
    } | null;
    task: {
      id: number;
      tarefa: string;
      tipo_dado: string | null;
    };
    taskPlanningMaintenance: {
      id: number;
      descriptionPlanMaintenance: {
        id: number;
        descricao: string;
      };
    };
    unity: {
      id: number;
      unidade: string;
    };
    registerHour: {
      id: number;
      inicio: Date;
      fim: Date | null;
    }[];
  };
  listByOrder: {
    id: number;
    status_exec: number | null;
    periodicidade_uso: Decimal | null;
    minutos: number | null;
    observacao: string | null;
    component: {
      id: number;
      componente: string;
    } | null;
    planTask: {
      ID: number;
      planDescription: {
        id: number;
        descricao: string;
      };
    } | null;
    task: {
      id: number;
      tarefa: string;
      tipo_dado: string | null;
    };
    registerHour: {
      id: number;
      inicio: Date;
      fim: Date;
    }[];
    taskPlanningMaintenance: {
      id: number;
      descriptionPlanMaintenance: {
        id: number;
        descricao: string;
      };
    };
    legendTask: {
      id: number;
      legenda: string;
      descricao: string;
    } | null;
    unity: {
      id: number;
      unidade: string;
    };
    taskReturn: {
      id: number;
      retorno_numero: number | null;
      retorno_opcao: number | null;
      retorno_texto: string | null;
    }[];
  };
}
