import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export default class UpdateInstallmentFinanceBody {
  @IsString()
  paymentTypeId: string;

  @IsBoolean()
  split: boolean;

  @IsDateString()
  dueDate: Date;

  @IsNumber()
  @IsOptional()
  quantitySplit: number | null;

  @IsBoolean()
  @IsOptional()
  fixedFrequency: boolean | null;

  @IsNumber()
  @IsOptional()
  paymentFrequency: number | null;
}
