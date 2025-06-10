// import { IsNotEmpty } from 'class-validator';
// import { MessageService } from 'src/service/message.service';

export class InsertActionGroupBody {
  itemsId: number[];

  title?: string;

  description: string;

  responsible: string;

  startDate?: Date;
  deadline: Date;
  doneAt?: Date;
  descriptionAction?: string;
}
