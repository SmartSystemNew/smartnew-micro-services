import { IsNumber, IsNumberString } from 'class-validator';

export default class UpdateProductBody {
  @IsNumberString()
  compartmentId: string;

  @IsNumber()
  value: number;

  @IsNumber()
  quantity: number;
}
