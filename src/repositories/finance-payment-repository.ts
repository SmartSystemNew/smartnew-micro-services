import {
  Prisma,
  smartnewsystem_financeiro_descricao_titulos_status,
  smartnewsystem_financeiro_titulo_pagamento,
} from '@prisma/client';
import {
  IFinancePayment,
  IGroupByDate,
  IListFinanceByDateAndDirection,
  IListViewExpressByDateAndClient,
  IListViewReceiveByDateAndClient,
  IRawGroupByDateByDirectionAndCostCenter,
  IListItemsByDateAndDirectionAndDescriptionCostCenter,
} from 'src/models/IFinancePayment';

export abstract class FinancePaymentRepository {
  abstract create(
    data: Prisma.smartnewsystem_financeiro_titulo_pagamentoUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_titulo_pagamento>;

  abstract findById(id: number): Promise<IFinancePayment['findById'] | null>;

  abstract sumByFinance(financeId: number): Promise<number>;

  abstract findByIds(
    id: number[],
  ): Promise<IFinancePayment['findByIds'][] | null>;

  abstract findIfWithEmission(
    id: number[],
  ): Promise<IFinancePayment['findIfWithEmission'][]>;

  abstract findByFinance(
    financeId: number,
  ): Promise<IFinancePayment['findByFinance'][]>;

  abstract sumSplit(id: number[]): Promise<number>;
  abstract listViewExpressByDateAndClient(
    clientId: number,
    startDate: string,
    endDate: string,
    costCenterId: number[],
    issued: boolean,
  ): Promise<IListViewExpressByDateAndClient[]>;

  abstract listViewReceiveByDateAndClient(
    clientId: number,
    startDate: string,
    endDate: string,
    costCenterId: number[],
    issued: boolean,
  ): Promise<IListViewReceiveByDateAndClient[]>;

  abstract sumViewExpressByDateAndClient(
    startDate: string,
    endDate: string,
    clientId: number,
    costCenterId: number[],
    issued: boolean,
  ): Promise<number>;

  abstract sumViewExpressByDateAndClientAndPay(
    startDate: string,
    endDate: string,
    clientId: number,
    costCenterId: number[],
    status: number[],
    issued: boolean,
  ): Promise<number>;

  abstract sumViewReceiveByDateAndClient(
    startDate: string,
    endDate: string,
    clientId: number,
    costCenterId: number[],
    issued: boolean,
  ): Promise<number>;

  abstract sumViewReceiveByDateAndClientAndPay(
    startDate: string,
    endDate: string,
    clientId: number,
    costCenterId: number[],
    status: number[],
    issued: boolean,
  ): Promise<number>;

  abstract aggregateSumByCostCenterAndStatusAndPay(
    clientId: number,
    direction: 'pagar' | 'receber',
    costCenterId: number[],
    startDate: Date,
    endDate: Date,
    status: smartnewsystem_financeiro_descricao_titulos_status[],
    pay?: number[],
  ): Promise<number>;

  abstract aggregateSumByFinance(financeId: number): Promise<number>;

  abstract listItemsByDateAndDirectionAndDescriptionCostCenter(
    clientId: number,
    startDate: Date,
    endDate: Date,
    direction: 'pagar' | 'receber',
    descriptionCostCenterId: number[],
  ): Promise<IListItemsByDateAndDirectionAndDescriptionCostCenter[]>;

  abstract listItemsByDateAndDirectionAndDescriptionCostCenterAndPay(
    clientId: number,
    startDate: Date,
    endDate: Date,
    direction: 'pagar' | 'receber',
    descriptionCostCenterId: number[],
    bankId?: number[],
  ): Promise<IListItemsByDateAndDirectionAndDescriptionCostCenter[]>;

  abstract listFinanceByDateAndDirection(
    startDate: Date,
    endDate: Date,
    direction: 'pagar' | 'receber',
  ): Promise<IListFinanceByDateAndDirection[]>;

  abstract listFinanceByDateAndDirectionAndCostCenter(
    startDate: Date,
    endDate: Date,
    direction: 'pagar' | 'receber',
    costCenterId: number[],
  ): Promise<IListFinanceByDateAndDirection[]>;

  abstract groupByDateAndDirectionAndFinance(
    startDate: Date,
    endDate: Date,
    direction: 'pagar' | 'receber',
    financeId: number[],
  ): Promise<IGroupByDate[]>;

  abstract groupByDateAndDirectionAndCostCenter(
    startDate: Date,
    endDate: Date,
    direction: 'pagar' | 'receber',
    costCenterId: number[],
  ): Promise<IGroupByDate[]>;

  abstract groupByDateAndDirection(
    startDate: Date,
    endDate: Date,
    direction: 'pagar' | 'receber',
  ): Promise<IGroupByDate[]>;

  abstract groupByDateByDirectionAndCostCenter(
    startDate: Date,
    endDate: Date,
    direction: 'pagar' | 'receber',
    costCenterId: number[],
  ): Promise<IGroupByDate[]>;

  abstract rawGroupByDateByDirectionAndCostCenter(
    startDate: Date,
    endDate: Date,
    direction: 'pagar' | 'receber',
    costCenterId: string,
  ): Promise<IRawGroupByDateByDirectionAndCostCenter[]>;

  abstract rawGroupByDateByDirection(
    startDate: Date,
    endDate: Date,
    direction: 'pagar' | 'receber',
  ): Promise<IRawGroupByDateByDirectionAndCostCenter[]>;

  abstract findLastByTitleAndDate(
    titleId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<smartnewsystem_financeiro_titulo_pagamento | null>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_financeiro_titulo_pagamentoUncheckedUpdateInput,
  ): Promise<smartnewsystem_financeiro_titulo_pagamento>;

  abstract updateStatusToExpired(clientId: number): Promise<boolean>;

  abstract delete(id: number): Promise<boolean>;

  abstract deleteByFinance(financeId: number): Promise<boolean>;
}
