import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { ValidateStringArrayAndTransformNumber } from 'src/service/validation.service';

export class CreateItemBody {
  @IsNumber()
  inputId: number;

  @IsNumber()
  compositionItemId: number;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsIn(['STOCK', 'EQUIPMENT', 'OS'])
  @IsOptional()
  bound?: 'STOCK' | 'EQUIPMENT' | 'OS';

  //@IsArrayOfNumbers()
  @IsString({
    each: true,
  })
  @Validate((value) => {
    if (Array.isArray(value)) {
      return value.every(
        (item) =>
          typeof item === 'number' ||
          (typeof item === 'string' && Number(item)),
      );
    } else {
      return (
        typeof value === 'number' ||
        (typeof value === 'string' && Number(value))
      );
    }
  })
  @IsOptional()
  equipment?: string[];

  @IsString({
    each: true,
  })
  @ValidateStringArrayAndTransformNumber()
  @IsOptional()
  order?: string[];
}
