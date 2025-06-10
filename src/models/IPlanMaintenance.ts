import { Prisma } from '@prisma/client';

export interface IPlanMaintenance {
  findById: {
    ID: number;
    id_plano_prev: number;
    seq: number;
    id_setor_executante: number;
    id_componente: number;
    tarefa: number;
    unidade_dia?: string;
    periodicidade_dias: number;
    obrigatorio: number;
    Tempo_hh: Prisma.Decimal;
    requer_imagem?: string;
    log_date: Date;
    log_user: string;
  };
  listByPlanDescription: {
    ID: number;
    id_plano_prev: number;
    seq: number;
    id_setor_executante: number;
    id_componente: number;
    unidade_dia?: string;
    periodicidade_dias: number;
    obrigatorio: number;
    Tempo_hh: Prisma.Decimal;
    requer_imagem?: string;
    log_date: Date;
    log_user: string;
  };
}
