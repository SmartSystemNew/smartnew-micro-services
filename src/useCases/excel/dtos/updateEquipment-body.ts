import { IsNumberString } from 'class-validator';

export default class UpdateEquipmentBody {
  @IsNumberString()
  clientId: string;
}
