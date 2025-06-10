import {
  Prisma,
  smartnewsystem_financeiro_emissao_tributos,
} from '@prisma/client';
import { IFinanceEmissionTaxation } from 'src/models/IFinanceEmissionTaxation';

export default abstract class FinanceEmissionTaxationRepository {
  abstract findById(
    id: number,
  ): Promise<IFinanceEmissionTaxation['findById'] | null>;
  abstract listByEmission(
    emissionId: number,
  ): Promise<IFinanceEmissionTaxation['listByEmission'][]>;

  abstract listByPayment(
    paymentId: number,
  ): Promise<IFinanceEmissionTaxation['listByPayment'][]>;

  abstract insert(
    data: Prisma.smartnewsystem_financeiro_emissao_tributosUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_emissao_tributos>;

  abstract delete(id: number): Promise<boolean>;
}
