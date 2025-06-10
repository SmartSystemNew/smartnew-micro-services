import { IsNumber, IsNumberString } from 'class-validator';

export class UpdateCompartmentBody {
  @IsNumberString()
  fuelId: string;

  @IsNumber()
  capacity: number;
}
