import { ApiProperty } from '@nestjs/swagger';

export default class ListChecklistQuerySwagger {
  @ApiProperty({ type: 'number', nullable: true, default: 0, required: false })
  index?: number | null;

  @ApiProperty({ type: 'number', nullable: true, default: 10, required: false })
  perPage?: number | null;

  @ApiProperty({ type: 'string', nullable: true, required: false })
  filterText?: string | null;

  @ApiProperty({ type: Date, nullable: true, required: false })
  dateFrom?: Date | null;

  @ApiProperty({ type: Date, nullable: true, required: false })
  dateTo?: Date | null;
}
