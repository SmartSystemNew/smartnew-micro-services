import { IsNumber, IsOptional } from 'class-validator';

export default class CreateItemBody {
  // @IsNumber()
  // seq: number;

  @IsNumber()
  taskId: number;

  @IsNumber()
  @IsOptional()
  modelId?: number | null;

  increment: number | null;

  periodicity: number;

  periodicityUse: number;

  dateBase: Date | null;

  dataInitial: Date | null;

  @IsNumber()
  @IsOptional()
  valueBase?: number | null;
}
