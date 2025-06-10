import { $Enums } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export default interface IDescriptionPlanning {
  listByClient: {
    id: number;
    descricao: string;
    valor_padrao: number;
    processamento: $Enums.sofman_descricao_planejamento_manutencao_processamento;
    incremento: number;
    sectorExecutor: {
      descricao: string;
      Id: number;
    };
    typeMaintenance: {
      ID: number;
      tipo_manutencao: string;
    };
    periodicity: {
      id: number;
      descricao: string;
    } | null;
    planningEquipment: {
      id: number;
      equipment: {
        descricao: string;
        ID: number;
        equipamento_codigo: string;
      };
    }[];
  };
  listByBranch: {
    id: number;
    descricao: string;
    valor_padrao: number;
    processamento: $Enums.sofman_descricao_planejamento_manutencao_processamento;
    incremento: number;
    family: {
      ID: number;
      familia: string;
    };
    sectorExecutor: {
      descricao: string;
      Id: number;
    };
    typeMaintenance: {
      ID: number;
      tipo_manutencao: string;
    };
    periodicity: {
      id: number;
      descricao: string;
    };
    planningEquipment: {
      id: number;
      equipment: {
        descricao: string;
        ID: number;
        equipamento_codigo: string;
      };
    }[];
  };
  findById: {
    id: number;
    descricao: string;
    valor_padrao: number;
    data_padrao: Date | null;
    processamento: $Enums.sofman_descricao_planejamento_manutencao_processamento;
    incremento: number;
    status_programacao: number;
    data_inicio: Date | null;
    valor_inicial: number | null;
    family: {
      ID: number;
      familia: string;
    } | null;
    sectorExecutor: {
      descricao: string;
      Id: number;
    };
    typeMaintenance: {
      ID: number;
      tipo_manutencao: string;
    };
    periodicity: {
      id: number;
      descricao: string;
    };
    planningEquipment: {
      id: number;
      equipment: {
        descricao: string;
        ID: number;
        equipamento_codigo: string;
      };
    }[];
    taskPlanningMaintenance: {
      id: number;
      periodicidade_uso: Decimal;
      valor_base: Decimal;
      data_base: Date | null;
      seq: number;
      data_inicio: Date | null;
      incremento_programacao: boolean;
      task: {
        id: number;
        tarefa: string;
      };
      modelChecklist: {
        id: number;
        descricao: string;
      } | null;
      periodicity: {
        id: number;
        descricao: string;
      } | null;
    }[];
  };
}
