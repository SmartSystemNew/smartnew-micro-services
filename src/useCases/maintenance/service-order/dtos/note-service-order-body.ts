import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class NoteServiceOrderBody {
  @ApiProperty()
  description?: string;
  @ApiProperty()
  comments?: string;
  @ApiProperty()
  tasks?: string;
  @ApiProperty()
  // @IsDateString()
  date?: Date;
  @ApiProperty()
  // @IsDateString()
  dateStartHour?: Date;
  @ApiProperty()
  // @IsDateString()
  dateEndHour?: Date;
  @ApiProperty()
  typeMaintenance?: string;
  @ApiProperty()
  idStatusServiceOrder?: number;
  @ApiProperty()
  aux?: string;
  @ApiProperty()
  @IsNumber()
  idEmployee?: number;
}
