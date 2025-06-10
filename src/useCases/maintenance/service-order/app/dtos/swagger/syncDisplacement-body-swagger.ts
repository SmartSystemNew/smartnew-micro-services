import { ApiProperty } from '@nestjs/swagger';

class SchemaPath {
  @ApiProperty({
    type: 'number',
  })
  latitude: number;

  @ApiProperty({
    type: 'number',
  })
  longitude: number;
}

class SchemaDisplacement {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  service_order_id: string;

  @ApiProperty({
    type: 'number',
  })
  start: number;

  @ApiProperty({
    type: 'number',
    nullable: true,
  })
  end: number | null;

  @ApiProperty({
    type: SchemaPath,
    isArray: true,
  })
  going: SchemaPath[];

  @ApiProperty({
    type: SchemaPath,
    isArray: true,
  })
  return: SchemaPath[];
}

export default class SyncDisplacementBodySwagger {
  @ApiProperty({
    type: SchemaDisplacement,
    isArray: true,
  })
  created: SchemaDisplacement[];

  @ApiProperty({
    type: SchemaDisplacement,
    isArray: true,
  })
  updated: SchemaDisplacement[];

  @ApiProperty({
    type: 'number',
    isArray: true,
  })
  deleted: number[];
}
