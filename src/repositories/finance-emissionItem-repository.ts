import {
  Prisma,
  smartnewsystem_financeiro_emissao_itens,
} from '@prisma/client';

export default abstract class FinanceEmissionItemRepository {
  abstract create(
    data: Prisma.smartnewsystem_financeiro_emissao_itensUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_emissao_itens>;
  abstract delete(id: number): Promise<boolean>;
  abstract deleteForPayment(paymentId: number): Promise<boolean>;
}
