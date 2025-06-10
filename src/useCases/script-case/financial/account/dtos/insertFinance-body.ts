import {
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export default class InsertFinanceBody {
  @IsOptional()
  @IsString()
  access_key: string;

  @IsDateString()
  date_emission: Date;

  @IsString()
  document_number: string;

  @IsNumberString()
  document_type: string;

  @IsNumberString()
  issuer_identification: string;

  @IsOptional()
  @IsString()
  observation: string;

  @IsNumberString()
  recipient: string;

  @IsEnum(['pagar', 'receber'])
  type: 'pagar' | 'receber';
}
