import { IsInt, IsString } from 'class-validator';

export default abstract class InsertOrderBody {
  @IsInt()
  clientId: number;

  @IsInt()
  branchId: number;

  @IsString()
  code: string;

  @IsString()
  description: string;

  @IsInt()
  equipmentId: number;
}
