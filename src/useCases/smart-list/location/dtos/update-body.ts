import { IsNotEmpty, IsString } from 'class-validator';

export default class UpdateBody {
  @IsString()
  tag: string | null;

  @IsString()
  categoryId: string | null;

  @IsString()
  @IsNotEmpty()
  description: string;
}
