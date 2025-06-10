import { IsNumber } from 'class-validator';

export default class UpdateSeqItemBody {
  @IsNumber()
  seq: number;
}
