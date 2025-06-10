import { IsNumberString, IsOptional, IsString } from 'class-validator';

export default class ImportEquipmentBody {
  @IsNumberString()
  clientId: string;

  @IsString()
  @IsOptional()
  logUser: string;
}
