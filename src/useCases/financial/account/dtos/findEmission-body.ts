import { IsArrayOfNumbers } from 'src/service/validation.service';

export default class findEmissionBody {
  @IsArrayOfNumbers()
  splitId: number[];
}
