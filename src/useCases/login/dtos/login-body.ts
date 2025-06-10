import { IsNotEmpty, Length } from 'class-validator';
import { MessageService } from 'src/service/message.service';

export class LoginBody {
  @IsNotEmpty({
    message: MessageService.Login_not_found,
  })
  login: string;

  @IsNotEmpty({
    message: MessageService.Pass_not_found,
  })
  @Length(3, 50, {
    message: MessageService.Pass_lass_size,
  })
  pass: string;

  clientBound: number | null;
}
