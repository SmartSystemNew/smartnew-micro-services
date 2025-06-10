import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class IMenu {
  @IsString()
  icon: string;

  @IsString()
  name: string;

  @IsString()
  application: string;

  @IsIn(['_self', '_blank'])
  target: '_self' | '_blank';

  @IsString()
  group: string;

  @IsNumber()
  order: number;

  @IsIn(['APLICACAO', 'RELATORIO'])
  type: 'APLICACAO' | 'RELATORIO';
}

export default class InsertBlankBody {
  @IsString()
  name: string;

  @IsBoolean()
  boundMenu: boolean;

  @IsNumber()
  @Min(1)
  moduleId: number;

  @IsIn(['blank', 'control'])
  type: 'blank' | 'control';

  @IsIn(['front', 'back'])
  typeView: 'front' | 'back';

  @IsString()
  description: string;

  @IsBoolean()
  status: boolean;

  @IsOptional()
  menu?: IMenu;
}
