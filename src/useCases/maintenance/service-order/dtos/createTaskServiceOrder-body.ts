import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export default class CreateTaskServiceOrder {
  @IsNumberString()
  taskId: string;

  @IsOptional()
  @IsNumberString()
  statusId: string | null;

  @IsOptional()
  @IsNumberString()
  componentId: string | null;

  @IsString()
  @IsOptional()
  observation: string | null;

  @IsNumber()
  @IsOptional()
  periodicity: number | null;

  @IsNumberString()
  @IsOptional()
  minute: number | null;

  @IsNumberString()
  @IsOptional()
  unity: string;
}
