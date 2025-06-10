// import { IsNotEmpty } from 'class-validator';
// import { MessageService } from 'src/service/message.service';

export class InsertActionBody {
  groupId?: number;
  actionId?: number;
  itemId: number;

  description: string;

  responsible: string;

  deadline: Date;

  doneAt?: Date;
  descriptionAction?: string;
}
