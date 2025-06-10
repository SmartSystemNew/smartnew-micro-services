import { IsNotEmpty } from 'class-validator';
import { MessageService } from 'src/service/message.service';

export class TaskByIdQuery {
  @IsNotEmpty({
    message: MessageService.Task_id_missing,
  })
  taskId: number;
}
