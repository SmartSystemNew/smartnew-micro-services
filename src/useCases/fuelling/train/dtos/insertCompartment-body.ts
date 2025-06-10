import { IsNumber, IsNumberString } from 'class-validator';

export class InsertCompartmentBody {
  @IsNumberString()
  fuelId: string;

  @IsNumber()
  capacity: number;
}
