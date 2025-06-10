import { IsDateString, IsInt } from 'class-validator';

export default class UpdatePaymentBody {
  @IsDateString()
  dueDate: string;

  @IsInt()
  value: number;
}
