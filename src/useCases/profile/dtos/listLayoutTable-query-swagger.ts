import { ApiProperty } from '@nestjs/swagger';

export default class ListLayoutTableQuerySwagger {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  screenName: string;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  tableName: string;
}
