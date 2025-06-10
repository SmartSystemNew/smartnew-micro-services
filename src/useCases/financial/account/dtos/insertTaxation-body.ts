import { IsIn, IsInt, IsNumber, IsString } from 'class-validator';

export default class InsertTaxationBody {
  @IsInt()
  emissionId: number;

  @IsInt()
  taxation: number;

  @IsNumber()
  value: number;

  @IsString()
  description: string;

  @IsIn(['ACRESCIMO', 'DESCONTO'])
  type: 'ACRESCIMO' | 'DESCONTO';
}
