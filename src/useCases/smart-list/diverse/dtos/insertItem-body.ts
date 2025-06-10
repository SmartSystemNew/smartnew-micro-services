import { IsNotEmpty } from 'class-validator';
import { MessageService } from 'src/service/message.service';

export default class InsertItemBody {
  @IsNotEmpty({
    message: MessageService.Diverse_name_item_not_found,
  })
  name: string;
}
