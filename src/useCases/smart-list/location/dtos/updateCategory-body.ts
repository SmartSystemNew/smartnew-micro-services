import { IsNotEmpty, IsString } from 'class-validator';

export default class UpdateCategoryBody {
  @IsString()
  @IsNotEmpty()
  category: string;
}
