import { IsNumberString } from 'class-validator';

export default class ImportFamilyBody {
  @IsNumberString()
  clientId: string;
}
