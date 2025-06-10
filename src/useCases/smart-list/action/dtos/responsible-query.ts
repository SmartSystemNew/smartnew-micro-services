import { IsNotEmpty } from 'class-validator';
import { MessageService } from 'src/service/message.service';

export class ResponsibleQuery {
  @IsNotEmpty({
    message: MessageService.ChecklistAction_itemId,
  })
  itemId: number;

  type: 'with-action' | 'without-action';
}
