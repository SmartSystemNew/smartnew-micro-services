export class UpdateInstallmentFinanceBody {
  paymentTypeId: string;
  split: boolean;
  quantitySplit: number;
  dueDate: Date;
  fixedFrequency: boolean | null;
  paymentFrequency: number | null;
}
