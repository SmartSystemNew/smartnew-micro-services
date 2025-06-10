import { ApiProperty } from '@nestjs/swagger';

export default class ListCalendarMaintainerQuerySwagger {
  @ApiProperty({
    type: Date,
  })
  startDate: Date;

  @ApiProperty({
    type: Date,
    nullable: true,
  })
  endDate: Date | null;

  @ApiProperty({
    type: 'number',
    isArray: true,
  })
  branchId: number[];
}
