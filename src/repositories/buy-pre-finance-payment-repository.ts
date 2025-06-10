import {
  Prisma,
  smartnewsystem_compras_pre_financeiro_pagamento,
} from '@prisma/client';
import IBuyPreFinancePayment from 'src/models/IBuyPreFinancePayment';

export default abstract class BuyPreFinancePaymentRepository {
  abstract listByBuy(
    buyId: number,
  ): Promise<IBuyPreFinancePayment['listByBuy'][]>;
  abstract create(
    data: Prisma.smartnewsystem_compras_pre_financeiro_pagamentoUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_pre_financeiro_pagamento>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_compras_pre_financeiro_pagamentoUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_pre_financeiro_pagamento>;

  abstract delete(id: number): Promise<boolean>;
}
