import { Prisma, smartnewsystem_contrato_numeracao } from '@prisma/client';

export abstract class ContractNumberRepository {
  abstract create(
    data: Prisma.smartnewsystem_contrato_numeracaoUncheckedCreateInput,
  ): Promise<smartnewsystem_contrato_numeracao>;

  abstract findLastByClientAndBranch(
    clientId: number,
    branchId: number,
  ): Promise<number>;
}
