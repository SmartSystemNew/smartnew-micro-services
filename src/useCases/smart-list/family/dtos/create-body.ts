import { IsNotEmpty } from 'class-validator';

export class CreateBody {
  @IsNotEmpty({
    message: '"family" is required',
  })
  family: string;

  branchId?: number;
}
