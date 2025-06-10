import {
  Prisma,
  smartnewsystem_financeiro_tipos_pagamento,
} from '@prisma/client';
import IFinanceTypePayment from 'src/models/IFinanceTypePayment';

export default abstract class FinanceTypePaymentRepository {
  abstract create(
    data: Prisma.smartnewsystem_financeiro_tipos_pagamentoUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_tipos_pagamento>;
  abstract listByClient(
    clientId: number,
  ): Promise<IFinanceTypePayment['listByClient'][]>;

  abstract findById(id: number): Promise<IFinanceTypePayment['findById']>;
}
