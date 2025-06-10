import { IsNumber } from 'class-validator';

export default class DuplicateFinanceBody {
  @IsNumber()
  fiscalNumber: number;
}
