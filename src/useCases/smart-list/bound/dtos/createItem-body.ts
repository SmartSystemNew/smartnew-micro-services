import { IsArray, IsNotEmpty } from 'class-validator';
import { MessageService } from 'src/service/message.service';

export class CheckListCreateItemBody {
  @IsArray({
    message: MessageService.Bound_taskId_not_found,
  })
  task: string[];

  @IsNotEmpty({
    message: MessageService.Bound_controlId_not_found,
  })
  controlId: number;
}
