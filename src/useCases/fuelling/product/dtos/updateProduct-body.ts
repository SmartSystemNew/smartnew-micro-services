import { IsString } from 'class-validator';

export default class UpdateProductBody {
  @IsString()
  description: string;

  @IsString()
  unity: string;
}
