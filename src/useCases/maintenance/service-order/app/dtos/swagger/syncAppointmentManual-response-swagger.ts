import { ApiProperty } from '@nestjs/swagger';

class SchemaAppointmentManualCreated {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  id_app: string;
}

export default class SyncAppointmentManualResponseSwagger {
  @ApiProperty({
    type: SchemaAppointmentManualCreated,
    isArray: true,
  })
  created: SchemaAppointmentManualCreated[];

  @ApiProperty({
    type: 'boolean',
  })
  sync: boolean;
}
