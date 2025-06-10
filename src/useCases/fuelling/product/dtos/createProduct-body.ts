import { IsString } from 'class-validator';

export default class CreateProductBody {
  @IsString()
  description: string;

  @IsString()
  unity: string;
}
