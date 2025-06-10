import { sofman_classificacao_ordem_servico, Prisma } from '@prisma/client';

export default abstract class ClassificationServiceOrderRepository {
  abstract listByClassification(
    clientId: number,
  ): Promise<sofman_classificacao_ordem_servico[]>;

  abstract listByClient(
    clientId: number,
    filter?: Prisma.sofman_classificacao_ordem_servicoWhereInput | null,
  ): Promise<sofman_classificacao_ordem_servico[]>;

  abstract findById(
    id: number,
  ): Promise<sofman_classificacao_ordem_servico | null>;

  abstract create(
    data: Prisma.sofman_classificacao_ordem_servicoCreateInput,
  ): Promise<sofman_classificacao_ordem_servico>;

  abstract update(
    id: number,
    data: Prisma.sofman_classificacao_ordem_servicoUpdateInput,
  ): Promise<sofman_classificacao_ordem_servico>;

  abstract delete(id: number): Promise<boolean>;
}
