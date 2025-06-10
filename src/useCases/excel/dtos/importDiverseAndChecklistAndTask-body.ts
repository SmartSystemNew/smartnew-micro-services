import { IsArray, IsNumberString, IsString } from 'class-validator';

export default class ImportDiverseAndChecklistAndTaskBody {
  @IsNumberString()
  clientId: string;

  @IsArray()
  @IsNumberString(
    {},
    {
      each: true,
    },
  )
  branches: number[];

  @IsString()
  logUser: string;
}
