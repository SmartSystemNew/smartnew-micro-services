import { IsInt, IsString, ValidateNested } from 'class-validator';

class FamilyBody {
  @IsString()
  description: string;
}

export default abstract class InsertEquipmentBody {
  @IsInt()
  clientId: number;

  @IsInt()
  branchId: number;

  @IsString()
  code: string;

  @IsString()
  description: string;

  @IsString()
  frota: string;

  @ValidateNested()
  family: FamilyBody;

  @IsString()
  user: string;
}
