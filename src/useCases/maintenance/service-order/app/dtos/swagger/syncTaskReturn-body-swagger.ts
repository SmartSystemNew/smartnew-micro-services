import { ApiProperty } from '@nestjs/swagger';

class SchemaTaskReturn {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  task_service_order_id: string;

  @ApiProperty({
    type: 'string',
  })
  task_id: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  return_text: string | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
  })
  return_number: number | null;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  return_option: number | null;
}

export default class SyncTaskReturnBodySwagger {
  @ApiProperty({
    type: SchemaTaskReturn,
    isArray: true,
  })
  created: SchemaTaskReturn[];

  @ApiProperty({
    type: SchemaTaskReturn,
    isArray: true,
  })
  updated: SchemaTaskReturn[];

  @ApiProperty({
    type: 'number',
    isArray: true,
  })
  deleted: number[];
}
