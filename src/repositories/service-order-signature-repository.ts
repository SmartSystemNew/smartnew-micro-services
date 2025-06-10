import { Prisma, sofman_assinatura_ordem_servico } from '@prisma/client';

export default abstract class ServiceOrderSignatureRepository {
  abstract findById(
    id: number,
  ): Promise<sofman_assinatura_ordem_servico | null>;

  abstract create(
    data: Prisma.sofman_assinatura_ordem_servicoUncheckedCreateInput,
  ): Promise<sofman_assinatura_ordem_servico>;

  abstract update(
    id: number,
    data: Prisma.sofman_assinatura_ordem_servicoUncheckedUpdateInput,
  ): Promise<sofman_assinatura_ordem_servico>;

  abstract delete(id: number): Promise<boolean>;
}
