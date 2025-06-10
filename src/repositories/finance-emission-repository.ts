import { Prisma, smartnewsystem_financeiro_emissao } from '@prisma/client';

export default abstract class FinanceEmissionRepository {
  abstract create(
    data: Prisma.smartnewsystem_financeiro_emissaoUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_emissao>;

  abstract delete(id: number): Promise<boolean>;
}
