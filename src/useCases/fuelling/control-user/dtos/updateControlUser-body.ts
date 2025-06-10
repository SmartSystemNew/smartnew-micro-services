import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export default class UpdatedControlUserBody {
  @IsNumber()
  branchId: number;

  @IsString()
  user: string;

  @IsEnum(['driver', 'supplier'])
  type: 'driver' | 'supplier';

  @IsString({})
  @Length(6, 20, {
    message: 'Sua senha precisa ter entre 6 e 20 caracteres.',
  })
  password: string;

  @IsNumber()
  @IsOptional()
  trainId: number | null;
}
