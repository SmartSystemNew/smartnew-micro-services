import { Prisma, smartnewsystem_financeiro_numero } from '@prisma/client';

export default abstract class FinanceNumberRepository {
  abstract insert(
    data: Prisma.smartnewsystem_financeiro_numeroUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_numero>;

  abstract findLastNumber(clientId: number): Promise<number>;
}
