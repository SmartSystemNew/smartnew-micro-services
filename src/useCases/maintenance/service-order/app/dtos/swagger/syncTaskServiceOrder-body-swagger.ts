import { ApiProperty } from '@nestjs/swagger';

class SchemaRegisterHour {
  @ApiProperty({
    type: Date,
  })
  start: Date;

  @ApiProperty({
    type: Date,
  })
  end: Date;
}

class SchemaSyncTaskServiceOrder {
  @ApiProperty({
    type: 'string',
  })
  task_id: string;

  @ApiProperty({
    type: 'string',
  })
  service_order_id: string;

  @ApiProperty({
    type: 'string',
  })
  status_id: string;

  @ApiProperty({
    type: SchemaRegisterHour,
    isArray: true,
  })
  register_hour: {
    id: string;
    start: Date;
    end: Date;
  }[];
}

export default class SyncTaskServiceOrderBodySwagger {
  @ApiProperty({
    type: SchemaSyncTaskServiceOrder,
    isArray: true,
  })
  created: SchemaSyncTaskServiceOrder[];

  @ApiProperty({
    type: SchemaSyncTaskServiceOrder,
    isArray: true,
  })
  updated: SchemaSyncTaskServiceOrder[];

  @ApiProperty({
    type: 'number',
    isArray: true,
  })
  deleted: number[];
}
