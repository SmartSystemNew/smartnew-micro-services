import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class InsertTrainBody {
  @IsNumberString()
  branchId: string;

  @IsString()
  tag: string;

  @IsString()
  name: string;

  @IsNumber()
  capacity: number;
}
