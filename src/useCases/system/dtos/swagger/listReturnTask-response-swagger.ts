import { ApiProperty } from '@nestjs/swagger';

class SchemaListReturnTask {
  @ApiProperty({
    type: 'number',
  })
  id: number;

  @ApiProperty({
    type: 'string',
  })
  description: string;
}

export default class ListReturnTaskResponseSwagger {
  @ApiProperty({
    type: 'number',
  })
  id: number;

  @ApiProperty({
    type: 'string',
  })
  description: string;

  @ApiProperty({
    type: 'string',
  })
  type: string;

  @ApiProperty({
    type: SchemaListReturnTask,
    isArray: true,
  })
  option: {
    id: number;
    description: string;
  }[];
}
