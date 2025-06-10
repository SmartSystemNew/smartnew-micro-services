import { Prisma, smartnewsystem_financeiro_tributacoes } from '@prisma/client';
import IFinanceTaxation from 'src/models/IFinanceTaxation';

export default abstract class FinanceTaxationRepository {
  abstract findById(
    id: number,
  ): Promise<smartnewsystem_financeiro_tributacoes | null>;
  abstract findByClient(
    clientId: number,
  ): Promise<IFinanceTaxation['findByClient'][]>;
  abstract insert(
    data: Prisma.smartnewsystem_financeiro_tributacoesUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_tributacoes>;
}
