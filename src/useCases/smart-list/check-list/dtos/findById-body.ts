import { IsNotEmpty } from 'class-validator';
import { MessageService } from 'src/service/message.service';

export class FindByIdBody {
  @IsNotEmpty({
    message: MessageService.Production_id_not_found,
  })
  productionId: number;
}
