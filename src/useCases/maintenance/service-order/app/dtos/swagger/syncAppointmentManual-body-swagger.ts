import { ApiProperty } from '@nestjs/swagger';

class SchemaSyncAppointmentManual {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'number',
  })
  service_order_id: number;

  @ApiProperty({
    type: Date,
    nullable: true,
  })
  start: Date | null;

  @ApiProperty({
    type: Date,
    nullable: true,
  })
  end: Date | null;
}

export default class SyncAppointmentManualBodySwagger {
  @ApiProperty({
    type: SchemaSyncAppointmentManual,
    isArray: true,
  })
  created: SchemaSyncAppointmentManual[];

  @ApiProperty({
    type: SchemaSyncAppointmentManual,
    isArray: true,
  })
  updated: SchemaSyncAppointmentManual[];

  @ApiProperty({
    type: 'number',
    isArray: true,
  })
  deleted: number[];
}
