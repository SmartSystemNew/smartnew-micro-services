export class listReportBody {
  startDate: Date;
  endDate: Date;
  costCenterId?: number[];
  direction: 'pagar' | 'receber';
  paid: boolean;
}
