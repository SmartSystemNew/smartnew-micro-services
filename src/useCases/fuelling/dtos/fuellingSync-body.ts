import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

class Values {
  @IsNumber()
  equipmentId: number;

  @IsString()
  @IsOptional()
  numberFiscal: string | null;

  @IsString()
  @IsOptional()
  numberRequest: string | null;

  @IsNumber()
  @IsOptional()
  fuelStationId: string | null;

  @IsString()
  @IsOptional()
  trainId: string | null;

  @IsString()
  @IsOptional()
  compartmentId: string | null;

  @IsString()
  @IsOptional()
  tankId: string | null;

  @IsString()
  fuelId: string;

  @IsString()
  @IsOptional()
  driver: string | null;

  @IsString()
  @IsOptional()
  supplier: string | null;

  @IsDateString()
  fuellingDate: Date;

  @IsNumber()
  value: number;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsOptional()
  observation: string | null;

  @IsEnum(['INTERNO', 'EXTERNO'])
  type: 'INTERNO' | 'EXTERNO';

  @IsNumber()
  counterLast: number;

  @IsNumber()
  counter: number;

  @IsNumber()
  consumption: number;

  @IsNumber()
  odometerLast: number;

  @IsNumber()
  odometer: number;
}

export class FuellingSync {
  @IsObject()
  @IsOptional()
  create: Values | null;

  @IsObject()
  @IsOptional()
  update: (Values & { id: number }) | null;

  @IsObject()
  @IsOptional()
  del: { id: number } | null;
}
