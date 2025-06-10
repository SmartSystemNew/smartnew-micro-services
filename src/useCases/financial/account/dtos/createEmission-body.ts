import { IsIn, IsInt, Min } from 'class-validator';
import { MessageService } from 'src/service/message.service';
import {
  IsArrayOfNumbers,
  StringToDateTransform,
} from 'src/service/validation.service';

export default class CreateEmissionBody {
  @IsIn(['pagar', 'receber'], {
    message: MessageService.Finance_type_not_found,
  })
  type: 'pagar' | 'receber';

  @IsArrayOfNumbers()
  splitId: number[];

  @IsInt()
  @Min(0)
  bankId: number;

  @StringToDateTransform()
  dueDate: Date;
}
