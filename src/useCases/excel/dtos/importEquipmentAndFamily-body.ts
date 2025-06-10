import { IsNumberString, IsString } from 'class-validator';

export default class ImportEquipmentAndFamilyBody {
  @IsNumberString()
  clientId: string;

  @IsString()
  logUser: string;
}
