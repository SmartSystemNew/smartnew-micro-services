import {
  Prisma,
  smartnewsystem_financeiro_banco_movimentacao,
  smartnewsystem_financeiro_banco_movimentacao_tipo,
} from '@prisma/client';
import IFinanceBankTransaction from 'src/models/IFinanceBankTransaction';

export default abstract class FinanceBankTransactionRepository {
  abstract insert(
    data: Prisma.smartnewsystem_financeiro_banco_movimentacaoUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_banco_movimentacao>;
  abstract listByBank(
    bankId: number[],
    date?: { start: Date; end: Date },
  ): Promise<IFinanceBankTransaction['listByBank'][]>;
  abstract listByClient(
    clientId: number,
    date?: { start: Date; end: Date },
  ): Promise<IFinanceBankTransaction['listByClient'][]>;
  abstract findByEmission(
    emissionId: number,
  ): Promise<smartnewsystem_financeiro_banco_movimentacao | null>;

  abstract sumManyBankValues(
    idBank: number[],
    operations: smartnewsystem_financeiro_banco_movimentacao_tipo[],
  ): Promise<number>;

  abstract sumAllBankValuesByClient(
    clientId: number,
    operations: smartnewsystem_financeiro_banco_movimentacao_tipo[],
    date?: {
      start: Date;
      end: Date;
    },
  ): Promise<number>;

  abstract sumValues(
    idClient: number,
    idBank: number,
    operations: smartnewsystem_financeiro_banco_movimentacao_tipo[],
  ): Promise<number>;
  abstract sumValuesIn(
    idClient: number,
    idBank: number,
    operations?: smartnewsystem_financeiro_banco_movimentacao_tipo[],
  ): Promise<number>;
  abstract sumValuesOut(
    idClient: number,
    idBank: number,
    operations?: smartnewsystem_financeiro_banco_movimentacao_tipo[],
  ): Promise<number>;
}
