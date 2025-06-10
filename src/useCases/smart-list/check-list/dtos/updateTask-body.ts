import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MessageService } from 'src/service/message.service';

export class UpdateTaskBody {
  @IsNotEmpty({
    message: MessageService.Answer_not_found,
  })
  answerId: number;

  @IsNumber()
  @IsOptional({
    message: MessageService.AnswerAction_not_found,
  })
  childId?: number | null;

  @IsString({
    message: MessageService.Observation_task_not_found,
  })
  @IsOptional()
  observation?: string | null;

  @IsOptional({
    message: MessageService.Img_task_not_found,
  })
  newImages?: { base64: string }[];

  removedImages?: string[];
}
