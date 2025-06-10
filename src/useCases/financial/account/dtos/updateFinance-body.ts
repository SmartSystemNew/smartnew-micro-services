import { IsString } from 'class-validator';

export default class UpdateFinanceBody {
  @IsString()
  observation: string;
}
