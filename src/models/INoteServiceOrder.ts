import { Prisma } from '@prisma/client';

export interface INoteServiceOrder {
  findById: {
    id: number;
    descricao?: string;
    observacoes?: string;
    tarefas?: string;
    data?: Date;
    data_hora_inicio?: Date;
    data_hora_inicio_timestamp?: number;
    data_hora_termino?: Date;
    data_hora_termino_timestamp?: number;
    tempo_real?: Prisma.Decimal;
    valor_hora?: Prisma.Decimal;
    tipo_manutencao?: string;
    finalizado: number;
    id_projeto: number;
    log_date: Date;
    log_user?: string;
    aux?: string;
    id_equipamento: number;
    equipment: {
      ID: number;
      equipamento_codigo: string;
    };
    id_cliente: number;
    company: {
      ID: number;
      razao_social: string;
    };
    id_filial: number;
    branch: {
      ID: number;
      filial_numero: string;
    };
    id_ordem: number;
    serviceOrder: {
      ID: number;
      ordem: string;
    };
    id_status_os?: number;
    statusServiceOrder?: {
      id: number;
      status: string;
    };
    id_colaborador: number;
    employee: {
      id: number;
      nome: string;
    };
  };
  listByClient: {
    id: number;
    descricao?: string;
    observacoes?: string;
    tarefas?: string;
    data?: Date;
    data_hora_inicio?: Date;
    data_hora_inicio_timestamp?: number;
    data_hora_termino?: Date;
    data_hora_termino_timestamp?: number;
    tempo_real?: Prisma.Decimal;
    valor_hora?: Prisma.Decimal;
    tipo_manutencao?: string;
    finalizado: number;
    id_projeto: number;
    log_date: Date;
    log_user?: string;
    aux?: string;
    id_equipamento: number;
    equipment: {
      ID: number;
      equipamento_codigo: string;
    };
    id_cliente: number;
    company: {
      ID: number;
      razao_social: string;
    };
    id_filial: number;
    branch: {
      ID: number;
      filial_numero: string;
    };
    id_ordem: number;
    serviceOrder: {
      ID: number;
      ordem: string;
    };
    id_status_os?: number;
    statusServiceOrder?: {
      id: number;
      status: string;
    };
    id_colaborador: number;
    employee: {
      id: number;
      nome: string;
    };
  };
  listByBranches: {
    id: number;
    descricao?: string;
    observacoes?: string;
    tarefas?: string;
    data?: Date;
    data_hora_inicio?: Date;
    data_hora_termino?: Date;
    tempo_real?: Prisma.Decimal;
    valor_hora?: Prisma.Decimal;
    tipo_manutencao?: string;
    finalizado: number;
    id_projeto: number;
    log_date: Date;
    log_user?: string;
    aux?: string;
    id_equipamento: number;
    equipment: {
      ID: number;
      equipamento_codigo: string;
    };
    id_cliente: number;
    company: {
      ID: number;
      razao_social: string;
    };
    id_filial: number;
    branch: {
      ID: number;
      filial_numero: string;
    };
    id_ordem: number;
    serviceOrder: {
      ID: number;
      ordem: string;
    };
    id_status_os?: number;
    statusServiceOrder?: {
      id: number;
      status: string;
    };
    id_colaborador: number;
    employee: {
      id: number;
      nome: string;
    };
  };
}
