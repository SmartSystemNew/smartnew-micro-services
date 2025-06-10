import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class UpdateTrainBody {
  @IsNumberString()
  branchId: string;

  @IsString()
  tag: string;

  @IsString()
  name: string;

  @IsNumber()
  capacity: number;
}
