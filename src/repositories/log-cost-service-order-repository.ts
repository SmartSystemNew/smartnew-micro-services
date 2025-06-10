import { log_sofman_cad_custos_ordem_servico, Prisma } from '@prisma/client';

export default abstract class LogCostServiceOrderRepository {
  abstract listByBranches(
    branches: number[],
    filter?: Prisma.log_sofman_cad_custos_ordem_servicoWhereInput | null,
  ): Promise<log_sofman_cad_custos_ordem_servico[]>;

  abstract listByServiceOrderGroupByCost(
    id_ordem_servico: number[],
    filters: Prisma.log_sofman_cad_custos_ordem_servicoWhereInput,
  ): Promise<log_sofman_cad_custos_ordem_servico[]>;

  abstract createServiceOrderCost(
    data: Prisma.log_sofman_cad_custos_ordem_servicoUncheckedCreateInput,
  ): Promise<log_sofman_cad_custos_ordem_servico>;

  abstract updateServiceOrderCost(
    id: number,
    data: Prisma.log_sofman_cad_custos_ordem_servicoUncheckedUpdateInput,
  ): Promise<log_sofman_cad_custos_ordem_servico>;

  abstract deleteServiceOrderCost(id: number): Promise<boolean>;
}
