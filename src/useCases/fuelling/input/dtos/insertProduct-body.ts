import { IsNumber, IsNumberString } from 'class-validator';

export default class InsertProductBody {
  @IsNumberString()
  compartmentId: string;

  @IsNumber()
  value: number;

  @IsNumber()
  quantity: number;
}
