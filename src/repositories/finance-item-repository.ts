import {
  Prisma,
  smartnewsystem_financeiro_titulos_dados,
} from '@prisma/client';
import {
  IAggregateByTitle,
  IFindByTitle,
  IListFinanceByCostCenterAndDirection,
} from 'src/models/IFinanceItem';

export abstract class FinanceItemRepository {
  abstract aggregateByTitle(titleId: number): Promise<IAggregateByTitle>;
  abstract listFinanceByCostCenterAndDirection(
    costCenterId: number[],
    direction: 'pagar' | 'receber',
  ): Promise<IListFinanceByCostCenterAndDirection[]>;
  abstract findById(id: number): Promise<IFindByTitle | null>;
  abstract findByTitle(titleId: number): Promise<IFindByTitle[]>;
  abstract findByTitleNotDefault(
    titleId: number,
  ): Promise<smartnewsystem_financeiro_titulos_dados[]>;
  abstract findByTitleByDirection(
    titleId: number,
    direction: 'pagar' | 'receber',
  ): Promise<IFindByTitle[]>;
  abstract insert(
    data: Prisma.smartnewsystem_financeiro_titulos_dadosUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_titulos_dados>;
  abstract countItem(titleId: number): Promise<number>;
  abstract update(
    id: number,
    data: Prisma.smartnewsystem_financeiro_titulos_dadosUncheckedUpdateInput,
  ): Promise<smartnewsystem_financeiro_titulos_dados>;
  abstract delete(id: number): Promise<boolean>;
  abstract deleteByFinance(financeId: number): Promise<boolean>;
}
