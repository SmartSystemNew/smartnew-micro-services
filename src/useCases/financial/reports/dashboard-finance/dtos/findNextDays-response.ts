export interface FindNextDaysResponse {
  next: {
    date: Date;
    receive: number;
    express: number;
    netProfit: number;
  }[];
}
