import { IsBoolean, IsNumberString, IsString } from 'class-validator';

export default class UpdateRequesterBody {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsBoolean()
  notification: boolean;

  @IsBoolean()
  status: boolean;

  @IsString()
  observation: string;

  @IsNumberString()
  branchId: string;
}
