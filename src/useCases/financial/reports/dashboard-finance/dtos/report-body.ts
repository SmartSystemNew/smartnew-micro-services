export class ReportBody {
  costCenter: number[];
  startDate: Date;
  endDate: Date;
  issued: boolean;
  type?: 'monthly' | 'daily';
}
