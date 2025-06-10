import { ApiProperty } from '@nestjs/swagger';

class SchemaOptionTask {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  description: string;
}

export default class ListOptionTaskResponseSwagger {
  @ApiProperty({
    type: SchemaOptionTask,
    isArray: true,
  })
  created: SchemaOptionTask[];

  @ApiProperty({
    type: SchemaOptionTask,
    isArray: true,
  })
  updated: SchemaOptionTask[];

  @ApiProperty({
    type: SchemaOptionTask,
    isArray: true,
  })
  deleted: SchemaOptionTask[];
}
