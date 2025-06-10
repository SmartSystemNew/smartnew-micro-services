import { ApiProperty } from '@nestjs/swagger';

export default class ListLiberationResponseSwagger {
  @ApiProperty({
    type: 'number',
  })
  id: number;

  @ApiProperty({
    type: 'string',
  })
  branch: string;

  @ApiProperty({
    type: 'string',
  })
  emission: Date;

  @ApiProperty({
    type: 'string',
  })
  number: string;

  @ApiProperty({
    type: 'string',
  })
  observation: string;

  @ApiProperty({
    type: 'string',
  })
  status: string;
}
