import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export default class UpdateTaskServiceOrder {
  @IsNumber()
  @IsOptional()
  statusId: number | null;

  @IsNumber()
  @IsOptional()
  periodicity: number | null;

  @IsNumber()
  @IsOptional()
  componentId: number | null;

  @IsString()
  @IsOptional()
  observation: string | null;

  response: any | null;

  @IsNumber()
  @IsOptional()
  minute: number | null;

  @IsNumberString()
  @IsOptional()
  unity: string;
}
