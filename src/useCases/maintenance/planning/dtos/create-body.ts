import {
  IsArray,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export default class CreateBody {
  @IsNumber()
  familyId: number;

  @IsArray({
    context: IsNumber(),
  })
  equipmentId: number[];

  // @IsNumber()
  // unityId: number;

  @IsNumberString()
  sectorExecutingId: string;

  @IsNumberString()
  typeMaintenanceId: string;

  @IsNumber()
  periodicityId: number;

  @IsNumber()
  @IsOptional()
  increment?: string | null;

  @IsNumber()
  @IsOptional()
  valueDefault?: number | null;

  @IsNumber()
  @IsOptional()
  valueBase?: number | null;

  @IsOptional()
  dateDefault?: Date | null;

  @IsOptional()
  dateInitial?: Date | null;

  @IsOptional()
  enable?: boolean | null;

  @IsString()
  description: string;

  @IsEnum(['automatico', 'manual'])
  type: 'automatico' | 'manual';
}
