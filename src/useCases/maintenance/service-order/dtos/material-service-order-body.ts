import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class MaterialServiceOrderBody {
  @ApiProperty()
  idPlanTask: number;
  @ApiProperty()
  idProgrammingR2: number;
  @ApiProperty()
  category: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  @IsNumber()
  idMaterial: number;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  idSecondary: number;
  @ApiProperty()
  @IsNumberString()
  quantity: string;
  @ApiProperty()
  unit: string;
  @ApiProperty()
  valueUnit: string;
  @ApiProperty()
  valueTotal: string;
  @ApiProperty()
  utilized: string;
  @ApiProperty()
  comments: string;
  @ApiProperty()
  @IsDateString()
  @IsOptional()
  dateUse: Date | null;
  @ApiProperty()
  serialNumberOld: string;
  @ApiProperty()
  serialNumberNew: string;
  @ApiProperty()
  idSession: string;
}
