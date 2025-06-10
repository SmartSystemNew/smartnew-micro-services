import { Prisma, smartnewsystem_financeiro_controle } from '@prisma/client';

export default abstract class FinanceControlRepository {
  abstract insert(
    data: Prisma.smartnewsystem_financeiro_controleUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_controle>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_financeiro_controleUncheckedUpdateInput,
  ): Promise<smartnewsystem_financeiro_controle>;

  abstract delete(id: number): Promise<boolean>;
}
