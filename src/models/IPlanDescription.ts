import { Prisma } from '@prisma/client';

export interface IPlanDescription {
  findById: {
    id: number;
    id_cliente?: number;
    id_subgrupo?: number;
    filiais?: string;
    id_familia?: number;
    descricao?: string;
    logo?: Uint8Array;
    log_date: Date;
    log_user?: string;
    familyEquipment?: {
      ID: number;
      familia: string;
    };
    subGroup?: {
      id: number;
      descricao: string;
    };
    plan_x_branch?: {
      id_filial: number | null;
    }[];
    plans: {
      ID: number;
      seq: number;
      id_setor_executante?: number;
      id_componente?: number;
      unidade_dia?: string;
      periodicidade_dias?: number;
      obrigatorio: number;
      Tempo_hh: Prisma.Decimal;
    }[];
  };
  listByClient: {
    id: number;
    id_cliente?: number;
    id_subgrupo?: number;
    filiais?: string;
    id_familia?: number;
    descricao?: string;
    logo?: Uint8Array;
    log_date: Date;
    log_user?: string;
    familyEquipment?: {
      ID: number;
    };
    subGroup?: {
      id: number;
    };
    plan_x_branch?: {
      id_filial: number | null;
    }[];
    plans: {
      ID: number;
    }[];
  };
  listByBranches: {
    id: number;
    id_cliente?: number;
    id_subgrupo?: number;
    filiais?: string;
    id_familia?: number;
    descricao?: string;
    logo?: Uint8Array;
    log_date: Date;
    log_user?: string;
    familyEquipment?: {
      ID: number;
    };
    subGroup?: {
      id: number;
    };
    plan_x_branch?: {
      id_filial: number | null;
    }[];
    plans: {
      ID: number;
    }[];
  };
}
