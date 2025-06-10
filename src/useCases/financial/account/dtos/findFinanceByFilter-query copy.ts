import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  Validate,
} from 'class-validator';

export default class FindFinanceByFilterQuery {
  @IsIn(['pagar', 'receber'])
  type: 'pagar' | 'receber';

  @IsDateString()
  @IsOptional()
  emissionDate: Date | null;

  @IsInt()
  @IsOptional()
  issue: number | null;

  @IsInt()
  @IsOptional()
  sender: number | null;

  @Validate((value) => {
    if (!isNaN(value)) {
      return false;
    }
  })
  @Transform((value) => Number(value))
  @IsOptional()
  fiscalNumber: number | null;
}
