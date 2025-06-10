import { IsNotEmpty } from 'class-validator';
import { MessageService } from 'src/service/message.service';

export class updatePathBody {
  @IsNotEmpty({
    message: MessageService.UrlFile_not_found,
  })
  urlFile: string;
}
