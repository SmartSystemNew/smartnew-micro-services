import { IsNotEmpty } from 'class-validator';
import { MessageService } from 'src/service/message.service';

export class InsertBody {
  @IsNotEmpty({
    message: MessageService.Task_description_not_found,
  })
  description: string;
}
