import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { MessageService } from 'src/service/message.service';

export class CheckListCreateBody {
  @IsIn(['diverse', 'family'])
  type: 'diverse' | 'family';

  @IsOptional()
  familyId?: number[];

  @IsOptional()
  diverseId?: number[];

  @IsNotEmpty({
    message: MessageService.Bound_description_not_found,
  })
  description: string;

  @IsArray()
  task: number[];

  @IsNumber()
  control: number;

  @IsBoolean()
  @IsOptional()
  automatic: boolean | null;

  @IsNumber()
  @IsOptional()
  periodicity: number | null;

  @IsNumber()
  @IsOptional()
  typePeriodicity: number | null;

  @IsDateString()
  @IsOptional()
  dateBase: Date | null;

  @IsNumber()
  @IsOptional()
  horaBase: number | null;

  @IsNumber()
  @IsOptional()
  anticipation: number | null;

  @IsBoolean()
  @IsOptional()
  finalize: boolean | null;
}
