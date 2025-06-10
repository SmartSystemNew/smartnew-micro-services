import { IsNumber, IsIn, IsOptional, IsString } from 'class-validator';
import { ValidateStringArrayAndTransformNumber } from 'src/service/validation.service';

export default class UpdateItemBody {
  @IsNumber()
  inputId: number;

  @IsNumber()
  compositionItemId: number;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsIn(['BOUND', 'STOCK', 'EQUIPMENT', 'OS'])
  bound: 'BOUND' | 'STOCK' | 'EQUIPMENT' | 'OS';

  @IsString({
    each: true,
  })
  @ValidateStringArrayAndTransformNumber()
  @IsOptional()
  equipment?: string[];

  @IsString({
    each: true,
  })
  @ValidateStringArrayAndTransformNumber()
  @IsOptional()
  order?: string[];
}
