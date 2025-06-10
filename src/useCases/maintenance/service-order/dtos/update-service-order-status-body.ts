import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateServiceOrderStatusBody {
  @ApiProperty()
  @IsNumber()
  idStatusServiceOrder: number;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  dateEnd?: Date | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  justify?: string | null;
}
