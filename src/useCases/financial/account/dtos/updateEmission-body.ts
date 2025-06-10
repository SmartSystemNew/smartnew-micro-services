import { IsBoolean, IsIn, IsInt } from 'class-validator';
import { MessageService } from 'src/service/message.service';
import { StringToDateTransform } from 'src/service/validation.service';

export default class UpdateEmissionBody {
  @IsIn(['pagar', 'receber'], {
    message: MessageService.Finance_type_not_found,
  })
  type: 'pagar' | 'receber';

  @IsInt()
  bankId: number;

  @IsBoolean()
  paid: boolean;

  @StringToDateTransform()
  dueDate: Date;
}
