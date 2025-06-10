export default interface GenerateReportFinanceItem {
  startDate: Date;
  endDate: Date;
  branch: number[];
  type: 'pagar' | 'receber';
  paid: boolean;
}
