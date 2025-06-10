import {
  Prisma,
  smartnewsystem_financeiro_registro_tributo,
} from '@prisma/client';
import { IFinanceRegisterTribute } from 'src/models/IFinanceRegisterTribute';

export default abstract class FinanceRegisterTributeRepository {
  abstract findByFinance(
    financeId: number,
  ): Promise<IFinanceRegisterTribute['findByFinance'][]>;

  abstract findById(
    id: number,
  ): Promise<IFinanceRegisterTribute['findById'] | null>;

  abstract sumFinanceAndType(
    financeId: number,
    type: 'ACRESCIMO' | 'DESCONTO',
  ): Promise<number>;

  abstract create(
    data: Prisma.smartnewsystem_financeiro_registro_tributoUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_registro_tributo>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_financeiro_registro_tributoUncheckedUpdateInput,
  ): Promise<smartnewsystem_financeiro_registro_tributo>;

  abstract delete(id: number): Promise<boolean>;

  abstract deleteByFinance(financeId: number): Promise<boolean>;
}
