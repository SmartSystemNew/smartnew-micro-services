import { IFinanceStatus } from 'src/models/IFinance';

export interface FindFinanceResponse {
  id: number;
  documentType: string;
  direction: 'pagar' | 'receber';
  processNumber: number;
  fiscalNumber: number;
  description: string;
  //observation: string | null;
  paymentType: string;
  frequencyPay: boolean | null;
  total: number;
  split: number | null;
  quantitySplit: number | null;
  dueDate: Date | null;
  dateEmission: Date | null;
  dateLaunch: Date | null;
  issue: string;
  sender: string;
  key: string;
  status: IFinanceStatus;
  additionTotal: number;
  discountTotal: number;
  additionDiscount: number;
  liquidTotal: number;
  editable: boolean;
}
