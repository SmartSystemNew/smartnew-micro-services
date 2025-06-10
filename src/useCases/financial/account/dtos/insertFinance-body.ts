import { IsIn, IsNumber, IsString } from 'class-validator';
import { StringToDateTransform } from 'src/service/validation.service';

export default class InsertFinanceBody {
  @IsIn(['pagar', 'receber'])
  type: 'pagar' | 'receber';

  @IsNumber()
  typeDocument: number;

  @IsNumber()
  numberFiscal: number;

  @IsNumber()
  issue: number;

  @IsNumber()
  sender: number;

  @StringToDateTransform()
  dateEmission: Date;

  @IsString()
  key: string;

  @IsString()
  observation: string;
}
