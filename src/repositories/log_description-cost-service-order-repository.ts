import {
  Prisma,
  log_sofman_cad_descricao_custos_ordem_servico,
} from '@prisma/client';

export abstract class LogDescriptionCostServiceOrderRepository {
  abstract findById(
    id: number,
  ): Promise<log_sofman_cad_descricao_custos_ordem_servico | null>;

  abstract create(
    data: Prisma.log_sofman_cad_descricao_custos_ordem_servicoUncheckedCreateInput,
  ): Promise<log_sofman_cad_descricao_custos_ordem_servico>;

  abstract update(
    id: number,
    data: Prisma.log_sofman_cad_descricao_custos_ordem_servicoUncheckedUpdateInput,
  ): Promise<log_sofman_cad_descricao_custos_ordem_servico>;

  abstract delete(id: number): Promise<boolean>;

  abstract listByClient(
    idClient: number,
    filters?: Prisma.sofman_cad_descricao_custos_ordem_servicoWhereInput | any,
    fields?: string[],
  ): Promise<log_sofman_cad_descricao_custos_ordem_servico[]>;
}
