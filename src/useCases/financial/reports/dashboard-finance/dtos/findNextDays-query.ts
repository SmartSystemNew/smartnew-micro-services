export class FindNextDaysBody {
  perPage: number;
  page: number;
  nextDays: number;
  issued: boolean;
  costCenter: number[];
  startDate: string;
  endDate: string;
}
