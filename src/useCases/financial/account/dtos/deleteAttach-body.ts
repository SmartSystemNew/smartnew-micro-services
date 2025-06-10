import { IsString } from 'class-validator';

export default class deleteAttachBody {
  @IsString()
  file: string;
}
