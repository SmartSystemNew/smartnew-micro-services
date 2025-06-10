import { IsNumber, IsOptional } from 'class-validator';

export default class UpdateItemBody {
  // @IsNumber()
  // seq: number;

  @IsNumber()
  taskId: number;

  modelId: number;

  periodicity: number;

  periodicityUse: number;

  dateBase: Date | null;

  dataInitial: Date | null;

  @IsNumber()
  @IsOptional()
  increment: number;

  @IsNumber()
  @IsOptional()
  valueBase?: number | null;
}
