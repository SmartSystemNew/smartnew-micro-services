import { ApiProperty } from '@nestjs/swagger';

class SchemaListAppointmentManual {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  service_order_id: string;

  @ApiProperty({
    type: Date,
  })
  start: Date;

  @ApiProperty({
    type: Date,
  })
  end: Date;
}

export default class ListAppointmentManualResponseSwagger {
  @ApiProperty({
    type: SchemaListAppointmentManual,
    isArray: true,
  })
  created: SchemaListAppointmentManual[];

  @ApiProperty({
    type: SchemaListAppointmentManual,
    isArray: true,
  })
  updated: SchemaListAppointmentManual[];

  @ApiProperty({
    type: 'number',
    isArray: true,
  })
  deleted: number[];
}
