import {
  Prisma,
  smartnewsystem_numeracao_solicitacao_servico,
} from '@prisma/client';

export default abstract class NumberRequestServiceRepository {
  abstract findByClientAndBranchAndNumber(
    clientId: number,
    branchId: number,
    number: number,
  ): Promise<smartnewsystem_numeracao_solicitacao_servico | null>;
  abstract countByClientAndBranch(
    clientId: number,
    branchId: number,
  ): Promise<number>;

  abstract create(
    data: Prisma.smartnewsystem_numeracao_solicitacao_servicoUncheckedCreateInput,
  ): Promise<smartnewsystem_numeracao_solicitacao_servico>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_numeracao_solicitacao_servicoUncheckedUpdateInput,
  ): Promise<smartnewsystem_numeracao_solicitacao_servico>;

  abstract delete(id: number): Promise<boolean>;
}
