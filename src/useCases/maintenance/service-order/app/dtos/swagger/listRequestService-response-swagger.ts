import { ApiProperty } from '@nestjs/swagger';

class SchemaRequestService {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  equipment_id: string;

  @ApiProperty({
    type: 'string',
  })
  problem_id: string;

  @ApiProperty({
    type: 'string',
  })
  priority_id: string;

  @ApiProperty({
    type: 'boolean',
    nullable: true,
  })
  stopped_machine: boolean;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  subject: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    type: 'boolean',
    nullable: true,
  })
  approved: number;

  @ApiProperty({
    type: Date,
  })
  date_emission: Date;

  @ApiProperty({
    type: Date,
    nullable: true,
  })
  date_expected: Date;
}

export default class ListRequestServiceResponseSwagger {
  @ApiProperty({
    type: [SchemaRequestService],
  })
  created: SchemaRequestService[];

  @ApiProperty({
    type: [SchemaRequestService],
  })
  updated: SchemaRequestService[];

  @ApiProperty({
    type: ['number'],
  })
  deleted: number[];
}
