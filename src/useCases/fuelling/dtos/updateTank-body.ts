import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class UpdateTankBody {
  @IsNumberString()
  branchId: string;

  @IsString()
  tank: string;

  @IsString()
  model: string;

  @IsNumber()
  capacity: number;
  //odometer: number;
  // current: number;
  // limit: number;
}
