export class listReportQuery {
  startDate: Date;
  endDate: Date;
  costCenterId?: number[];
  direction: 'pagar' | 'receber';
}
