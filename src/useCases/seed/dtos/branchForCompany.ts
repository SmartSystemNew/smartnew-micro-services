import { IsBoolean, IsInt } from 'class-validator';

export default class BranchForCompany {
  @IsInt()
  branchId: number;

  @IsBoolean()
  duplicate: boolean;
}
