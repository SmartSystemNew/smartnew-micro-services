import { IsIn, IsInt, IsNumber, IsString } from 'class-validator';

export default class InsertRegisterBody {
  @IsInt()
  tributeId: number;

  @IsNumber()
  value: number;

  @IsString()
  description: string;

  @IsIn(['ACRESCIMO', 'DESCONTO'])
  type: 'ACRESCIMO' | 'DESCONTO';
}
