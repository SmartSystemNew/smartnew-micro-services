import { Prisma } from '@prisma/client';
import { IFinanceItemBound } from 'src/models/IFinanceItemBound';

export default abstract class FinanceItemBoundRepository
  implements FinanceItemBoundRepository
{
  abstract insert(
    data: Prisma.smartnewsystem_financeiro_dados_vinculoUncheckedCreateInput,
  ): Promise<IFinanceItemBound['insert']>;

  abstract findById(id: number): Promise<IFinanceItemBound['findById']>;

  abstract findByItem(itemId: number): Promise<IFinanceItemBound['findByItem']>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_financeiro_dados_vinculoUncheckedUpdateInput,
  ): Promise<IFinanceItemBound['update']>;
}
