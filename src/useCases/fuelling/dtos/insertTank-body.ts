import { IsNumber, IsNumberString, IsString } from 'class-validator';
//import { IsNumberOrString } from 'src/service/validation.service';

export class InsertTankBody {
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
