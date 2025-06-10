import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

class SchemaPathResponse {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'number',
  })
  latitude: Decimal;

  @ApiProperty({
    type: 'number',
  })
  longitude: Decimal;
}

class SchemaDisplacementResponse {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'number',
  })
  start: number;

  @ApiProperty({
    type: 'number',
  })
  end: number;

  @ApiProperty({
    type: SchemaPathResponse,
    isArray: true,
  })
  going: SchemaPathResponse[];

  @ApiProperty({
    type: SchemaPathResponse,
    isArray: true,
  })
  return: SchemaPathResponse[];
}

export default class ListDisplacementResponseSwagger {
  @ApiProperty({
    type: SchemaDisplacementResponse,
    isArray: true,
  })
  displacement: SchemaDisplacementResponse[];
}
