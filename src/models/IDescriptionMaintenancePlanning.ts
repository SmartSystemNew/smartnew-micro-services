import { Prisma } from '@prisma/client';

export interface IDescriptionMaintenancePlanning {
  findByEquipmentCode: {
    id: number;
    descricao: string;
    status_programacao: number;
    equipment: {
      descricao: string;
      ID: number;
      equipamento_codigo: string;
    };
    taskPlanningMaintenance: {
      id: number;
      task: {
        id: number;
        tarefa: string;
      };
      periodicidade_uso: Prisma.Decimal;
      valor_base: Prisma.Decimal;
      unityPlans: {
        id: number;
        unidade: string;
      };
    }[];
  };
}
