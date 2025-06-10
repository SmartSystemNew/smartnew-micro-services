import { IsNumberString, IsString } from 'class-validator';

export default class ImportMaterialBody {
  @IsNumberString()
  clientId: string;

  @IsString()
  logUser: string;
}
