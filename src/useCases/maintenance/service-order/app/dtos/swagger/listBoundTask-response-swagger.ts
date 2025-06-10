import { ApiProperty } from '@nestjs/swagger';

class SchemaBoundTask {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  id_task: string;

  @ApiProperty({
    type: 'string',
  })
  id_option: string;
}

export default class ListBoundTaskResponseSwagger {
  @ApiProperty({
    type: SchemaBoundTask,
    isArray: true,
  })
  created: SchemaBoundTask[];

  @ApiProperty({
    type: SchemaBoundTask,
    isArray: true,
  })
  updated: SchemaBoundTask[];

  @ApiProperty({
    type: SchemaBoundTask,
    isArray: true,
  })
  deleted: SchemaBoundTask[];
}
