import { Optional } from '@nestjs/common';

export class InfoTableQuery {
  // @IsNotEmpty({
  //   message: MessageService.Query_index_missing,
  // })
  @Optional()
  index?: number;

  // @IsNotEmpty({
  //   message: MessageService.Query_per_page_missing,
  // })
  @Optional()
  perPage?: number;

  filterText?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
