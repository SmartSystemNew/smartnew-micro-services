import { IsNumber, IsNumberString } from 'class-validator';

export default class InsertCompartmentBody {
  @IsNumberString()
  fuelId: string;

  @IsNumber()
  capacity: number;
}
