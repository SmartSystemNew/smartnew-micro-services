import { IsNumber, IsString } from 'class-validator';

export default class UpdateJustifyStatusBody {
  @IsNumber()
  statusId: number;

  @IsString()
  justification: string;
}
