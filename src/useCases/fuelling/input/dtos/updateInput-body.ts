import {
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export default class UpdateInputBody {
  @IsNumberString()
  providerId: string;

  @IsNumberString()
  @IsOptional()
  tankId?: string;

  @IsNumberString()
  @IsOptional()
  trainId?: string;

  @IsString()
  fiscalNumber: string;

  @IsDateString()
  date: Date;
}
