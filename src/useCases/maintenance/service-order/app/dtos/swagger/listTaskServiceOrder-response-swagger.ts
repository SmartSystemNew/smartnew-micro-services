import { ApiProperty } from '@nestjs/swagger';

class SchemaRegisterHour {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: Date,
  })
  start_time: Date;

  @ApiProperty({
    type: Date,
  })
  end_time: Date;
}

class SchemaAppListTaskService {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  service_order_id: string;

  @ApiProperty({
    type: 'string',
  })
  status_id: string;

  @ApiProperty({
    type: 'string',
  })
  task_id: string;

  @ApiProperty({
    type: SchemaRegisterHour,
    isArray: true,
  })
  register_hour: {
    id: string;
    start_time: Date;
    end_time: Date;
  }[];
}

export default class AppListTaskServiceOrderResponseSwagger {
  @ApiProperty({
    type: SchemaAppListTaskService,
    isArray: true,
  })
  created: SchemaAppListTaskService[];

  @ApiProperty({
    type: SchemaAppListTaskService,
    isArray: true,
  })
  updated: SchemaAppListTaskService[];

  @ApiProperty({
    type: SchemaAppListTaskService,
    isArray: true,
  })
  deleted: SchemaAppListTaskService[];
}
