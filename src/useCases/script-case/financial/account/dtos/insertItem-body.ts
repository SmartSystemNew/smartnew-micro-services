import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export default class InsertItemBody {
  @IsEnum(['', 'STOCK', 'stock', 'OS', 'EQUIPMENT', 'equipment', 'os'])
  @IsOptional()
  bound:
    | ''
    | 'STOCK'
    | 'stock'
    | 'OS'
    | 'EQUIPMENT'
    | 'equipment'
    | 'os'
    | null;

  @IsNumberString()
  cost_center: string;

  @IsNumberString()
  input: string;

  @IsString()
  @IsOptional()
  item_bounded: string | null;

  @IsNumberString()
  quantity: string;

  // @IsNumber()
  // total: number;

  @IsNumberString()
  ['unitary-value']: string;
}
