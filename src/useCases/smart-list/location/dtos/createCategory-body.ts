import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateCategoryBody {
  @IsString()
  @IsNotEmpty()
  category: string;
}
