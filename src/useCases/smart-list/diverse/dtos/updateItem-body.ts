import { IsNotEmpty } from 'class-validator';
import { MessageService } from 'src/service/message.service';

export default class UpdateItemItemBody {
  @IsNotEmpty({
    message: MessageService.Diverse_name_item_not_found,
  })
  name: string;
}
