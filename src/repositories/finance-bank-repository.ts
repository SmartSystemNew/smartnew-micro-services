import { Prisma, smartnewsystem_financeiro_bancos } from '@prisma/client';
import IFinanceBank from 'src/models/IFinanceBank';

export default abstract class FinanceBankRepository {
  abstract listByClient(
    clientId: number,
    filters?: Prisma.smartnewsystem_financeiro_bancosWhereInput | any,
    fields?: string[],
  ): Promise<IFinanceBank['listByClient'][]>;
  abstract findById(id: number): Promise<IFinanceBank['findById']>;
  abstract update(
    id: number,
    data: Prisma.smartnewsystem_financeiro_bancosUncheckedUpdateInput,
  ): Promise<smartnewsystem_financeiro_bancos>;
}
