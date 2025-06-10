import { ApiProperty } from '@nestjs/swagger';

class SchemaRegisterHour {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  task_service_id: string;

  @ApiProperty({
    type: Date,
  })
  start: Date;

  @ApiProperty({
    type: Date,
  })
  end: Date;
}

export default class ListRegisterHourOfTaskServiceResponseSwagger {
  @ApiProperty({
    type: SchemaRegisterHour,
    isArray: true,
  })
  created: SchemaRegisterHour[];

  @ApiProperty({
    type: SchemaRegisterHour,
    isArray: true,
  })
  updated: SchemaRegisterHour[];

  @ApiProperty({
    type: 'number',
    isArray: true,
  })
  deleted: number[];
}
