export default interface GenerateReportQuery {
  branchId?: number[];
  bank?: number[];
  dateFrom?: Date;
  dateTo?: Date;
  pay?: boolean;
  withBank?: boolean;
  direction?: string[];
}
