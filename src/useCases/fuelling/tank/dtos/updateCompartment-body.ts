import { IsNumber, IsNumberString } from 'class-validator';

export default class UpdateCompartmentBody {
  @IsNumberString()
  fuelId: string;

  @IsNumber()
  capacity: number;
}
