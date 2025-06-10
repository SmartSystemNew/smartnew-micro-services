import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export default class InsertFuellingBody {
  @IsNumberString()
  equipmentId: string;

  @IsEnum(['INTERNO', 'EXTERNO'])
  type: 'INTERNO' | 'EXTERNO';

  @IsNumberString()
  @IsOptional()
  fuelStationId?: string;

  @IsNumberString()
  @IsOptional()
  trainId?: string;

  @IsNumberString()
  @IsOptional()
  tankId?: string;

  @IsNumberString()
  @IsOptional()
  fuelId: string | null;

  @IsNumberString()
  @IsOptional()
  compartmentId?: string;

  @IsString()
  @IsOptional()
  numberRequest: string | null;

  @IsString()
  @IsOptional()
  fiscalNumber: string | null;

  @IsString()
  @IsOptional()
  driver: string | null;

  @IsString()
  @IsOptional()
  supplier: string | null;

  @IsDateString()
  date: Date;

  @IsNumber()
  value: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  consumption: number;

  @IsString()
  @IsOptional()
  observation?: string | null;

  @IsNumber()
  @IsOptional()
  counter?: number;

  @IsNumber()
  @IsOptional()
  counterLast?: number;

  @IsNumber()
  @IsOptional()
  odometerLast?: number;

  @IsNumber()
  @IsOptional()
  odometer?: number;
}
