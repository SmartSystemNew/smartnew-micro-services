import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class FailureAnalysisServiceOrderBody {
  @ApiProperty()
  @IsNumber()
  idComponent: number;
  @ApiProperty()
  @IsNumber()
  idSymptom: number;
  @ApiProperty()
  @IsNumber()
  idCause: number;
  @ApiProperty()
  @IsNumber()
  idAction: number;
}
