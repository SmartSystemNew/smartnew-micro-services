import { Prisma } from '@prisma/client';

export interface ICostServiceOrder {
  findById: {
    id: number;
    id_ordem_servico: number;
    id_descricao_custo: number;
    quantidade: Prisma.Decimal;
    valor_unitario: Prisma.Decimal;
    custo: Prisma.Decimal;
    data_custo: Date;
    observacoes?: string;
    log_user?: string;
    log_date: Date;
  };
  listByServiceOrder: {
    id: number;
    id_ordem_servico: number;
    id_descricao_custo: number;
    quantidade: Prisma.Decimal;
    valor_unitario: Prisma.Decimal;
    custo: Prisma.Decimal;
    data_custo: Date;
    observacoes?: string;
    log_user?: string;
    log_date: Date;
  };
}
