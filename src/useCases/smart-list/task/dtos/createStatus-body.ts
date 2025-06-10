import { IsNotEmpty } from 'class-validator';
import { MessageService } from 'src/service/message.service';

export class CreateStatusBody {
  @IsNotEmpty({
    message: MessageService.Task_description_not_found,
  })
  description: string;

  @IsNotEmpty({
    message: MessageService.Task_impediment_not_found,
  })
  impediment: boolean;

  @IsNotEmpty({
    message: MessageService.Task_controlId_not_found,
  })
  controlId: number;
}
