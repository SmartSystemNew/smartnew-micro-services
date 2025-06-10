export default interface infoTableResponse {
  rows: {
    id: number;
    financeId: number;
    process: string;
    number: string;
    numberRequest: number | null;
    dateEmission: Date;
    issue: string;
    dueDate: Date;
    prorogation: Date;
    expectDate: Date | null;
    totalGross: number;
    valuePay: number;
    totalLiquid: number;
    numberSplit: number;
    status: string;
  }[];
  pageCount: number;
}
