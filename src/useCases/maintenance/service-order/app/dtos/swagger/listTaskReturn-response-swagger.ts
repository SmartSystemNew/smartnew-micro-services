import { ApiProperty } from '@nestjs/swagger';

class SchemaListTaskReturn {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  task_id: string;

  @ApiProperty({
    type: 'string',
  })
  task_service_order_id: string;

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
  return_option: string | null;
}

export default class ListTaskReturnResponseSwagger {
  @ApiProperty({
    type: SchemaListTaskReturn,
    isArray: true,
  })
  created: SchemaListTaskReturn[];

  @ApiProperty({
    type: SchemaListTaskReturn,
    isArray: true,
  })
  updated: SchemaListTaskReturn[];

  @ApiProperty({
    type: SchemaListTaskReturn,
    isArray: true,
  })
  deleted: SchemaListTaskReturn[];
}
