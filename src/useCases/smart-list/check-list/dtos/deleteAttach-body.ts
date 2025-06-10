import { IsNotEmpty } from 'class-validator';
import { MessageService } from 'src/service/message.service';

export class DeleteAttachBody {
  @IsNotEmpty({
    message: MessageService.UrlFile_not_found,
  })
  urlFile: string;
}
