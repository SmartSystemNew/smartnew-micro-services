import { IsNotEmpty, IsOptional } from 'class-validator';
import { MessageService } from 'src/service/message.service';

export default class editGroupBody {
  @IsNotEmpty({
    message: MessageService.ChecklistAction_deadline,
  })
  deadline: Date;
  @IsNotEmpty({
    message: MessageService.ChecklistAction_doneAt,
  })
  @IsOptional()
  doneAt: Date | null;
  @IsNotEmpty({
    message: MessageService.ChecklistAction_descriptionAction,
  })
  @IsOptional()
  descriptionAction?: string | null;
  @IsNotEmpty({
    message: MessageService.ChecklistAction_description,
  })
  description: string;
  @IsNotEmpty({
    message: MessageService.ChecklistAction_responsible,
  })
  responsible: string;
}
