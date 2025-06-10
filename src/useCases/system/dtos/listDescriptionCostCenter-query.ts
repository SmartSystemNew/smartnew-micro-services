import { IsArrayOfNumbers } from 'src/service/validation.service';

export default class ListDescriptionCostCenterQuery {
  @IsArrayOfNumbers()
  branchId: number[];
}
