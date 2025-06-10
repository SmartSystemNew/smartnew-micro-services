import { sofman_cad_prioridades_ordem_servico, Prisma } from '@prisma/client';

export default abstract class PriorityServiceOrderRepository {
  abstract listByClient(
    clientId: number,
    filter?: Prisma.sofman_cad_prioridades_ordem_servicoWhereInput | null,
  ): Promise<sofman_cad_prioridades_ordem_servico[]>;

  abstract findById(
    id: number,
  ): Promise<sofman_cad_prioridades_ordem_servico | null>;

  abstract create(
    data: Prisma.sofman_cad_prioridades_ordem_servicoUncheckedCreateInput,
  ): Promise<sofman_cad_prioridades_ordem_servico>;

  abstract update(
    id: number,
    data: Prisma.sofman_cad_prioridades_ordem_servicoUncheckedUpdateInput,
  ): Promise<sofman_cad_prioridades_ordem_servico>;

  abstract delete(id: number): Promise<boolean>;
}
