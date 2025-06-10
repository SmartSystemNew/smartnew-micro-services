import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export default class CreateBody {
  @IsNumber()
  branchId: number;

  @IsString()
  @IsOptional()
  tag?: string | null;

  @IsString()
  @IsOptional()
  categoryId?: string | null;

  @IsString()
  @IsNotEmpty()
  description: string;
}
