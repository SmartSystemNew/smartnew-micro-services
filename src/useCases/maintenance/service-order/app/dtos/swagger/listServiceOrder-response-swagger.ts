import { ApiProperty } from '@nestjs/swagger';

class SchemaServiceOrder {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  code: string;

  @ApiProperty({
    type: 'string',
  })
  description: string;

  @ApiProperty({
    type: Date,
  })
  date_emission: Date;

  @ApiProperty({
    type: Date,
  })
  date_request: Date;

  @ApiProperty({
    type: Date,
    nullable: true,
  })
  date_expected: Date | null;

  @ApiProperty({
    type: 'string',
  })
  branch_id: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  request_id: number | null;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  requester_id: string | null;

  @ApiProperty({
    type: 'string',
  })
  status_id: string;

  @ApiProperty({
    type: 'string',
  })
  equipment_id: string;

  @ApiProperty({
    type: 'string',
  })
  type_maintenance_id: string;

  @ApiProperty({
    type: 'string',
  })
  sector_executing_id: string;
}

export default class ListServiceOrderResponseSwagger {
  @ApiProperty({
    type: [SchemaServiceOrder],
  })
  created: SchemaServiceOrder[];

  @ApiProperty({
    type: [SchemaServiceOrder],
  })
  updated: SchemaServiceOrder[];

  @ApiProperty({
    type: ['number'],
  })
  deleted: number[];
}
