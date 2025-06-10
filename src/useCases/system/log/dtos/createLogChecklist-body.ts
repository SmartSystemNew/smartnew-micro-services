import { IsDateString, IsNumber, IsString } from 'class-validator';

export default class CreateLogChecklistBody {
  @IsNumber()
  clientId: number;

  @IsString()
  login: string;

  @IsString()
  message: string;

  @IsDateString()
  logDate: Date;
}
