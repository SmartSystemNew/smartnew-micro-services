import { IsNotEmpty } from 'class-validator';
import { MessageService } from 'src/service/message.service';

export class WithLoginBody {
  @IsNotEmpty({
    message: MessageService.Login_lass_size,
  })
  login: string;

  clientBound: number | null;
}
