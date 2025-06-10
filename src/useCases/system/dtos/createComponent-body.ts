import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateComponentBody {
  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  manufacturer: string | null;

  @IsString()
  @IsOptional()
  model: string | null;

  @IsString()
  @IsOptional()
  serialNumber: string | null;

  @IsNumber()
  @IsOptional()
  manufacturingYear: number | null;

  @IsString()
  status: string;
}
