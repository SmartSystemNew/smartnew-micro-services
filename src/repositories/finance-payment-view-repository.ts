import { Prisma } from '@prisma/client';
import IFinancePaymentView from 'src/models/IFinancePaymentView';

export abstract class FinancePaymentViewRepository {
  abstract infoTable(
    // clientId: string,
    take: number,
    skip: number,
    type: string,
    // dateEmission: string,
    // dueDate: string,
    // expectDate: string,
    // fiscalNumber: string,
    // forEmission: string,
    // issue: string,
    // prorogation: string,
    // sender: string,
    // status: string,
    // totalItem: string,
    // typePayment: string,
    // valuePay: string,
    // valueToPay: string,
    wherePay?: Prisma.smartnewsystem_view_financeiro_pagarWhereInput | null,
    whereReceive?: Prisma.smartnewsystem_view_financeiro_receberWhereInput | null,
  ): Promise<IFinancePaymentView['infoTable'][]>;

  abstract infoTableNoPage(
    type: 'pagar' | 'receber',
    wherePay?: Prisma.smartnewsystem_view_financeiro_pagarWhereInput | null,
    whereReceive?: Prisma.smartnewsystem_view_financeiro_receberWhereInput | null,
  ): Promise<IFinancePaymentView['infoTableNoPage'][]>;
}
