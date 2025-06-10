import { IsNumberString, IsString } from 'class-validator';

export default class ImportChecklistAndTaskAndFamily {
  @IsNumberString()
  clientId: string;

  @IsString()
  logUser: string;
}
