import { Prisma, log_sofman_assinatura_ordem_servico } from '@prisma/client';

export default abstract class LogServiceOrderSignatureRepository {
  abstract findLastBySignature(
    signatureId: number,
  ): Promise<log_sofman_assinatura_ordem_servico | null>;
  abstract listByBranches(
    branches: number[],
    filter?: Prisma.log_sofman_assinatura_ordem_servicoWhereInput | null,
  ): Promise<log_sofman_assinatura_ordem_servico[]>;

  abstract update(
    id: number,
    data: Prisma.log_sofman_assinatura_ordem_servicoUncheckedUpdateInput,
  ): Promise<log_sofman_assinatura_ordem_servico>;
}
