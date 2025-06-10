import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber } from 'class-validator';

export class PlanMaintenanceBody {
  @ApiProperty()
  id: number;
  @ApiProperty()
  @IsNumber()
  idPlanDescription: number;
  @ApiProperty()
  @IsNumber()
  order: number;
  @ApiProperty()
  idSectorExecutor?: number | null;
  @ApiProperty()
  idComponent?: number | null;
  @ApiProperty()
  unitDay: string;
  @ApiProperty()
  periodicityDay: number;
  @ApiProperty()
  required: number;
  @ApiProperty()
  timeHH: string;
  @ApiProperty()
  @IsEnum(['S', 'N'])
  requireImage: 'S' | 'N';
  @ApiProperty()
  @IsDateString()
  dateEmission?: Date;
  @ApiProperty()
  username?: string;
}
