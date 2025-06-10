import { IsNumber, IsOptional } from 'class-validator';

export default class CreateBoundChecklistBody {
  @IsNumber()
  @IsOptional()
  equipmentId: number;

  @IsNumber()
  @IsOptional()
  locationId: number;

  @IsNumber()
  @IsOptional()
  periodId: number;

  @IsNumber()
  @IsOptional()
  hourMeter: number;

  @IsNumber()
  @IsOptional()
  odometer: number;

  @IsNumber()
  @IsOptional()
  kilometer: number;

  @IsNumber()
  modelId: number;
}
