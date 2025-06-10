import { ApiProperty } from '@nestjs/swagger';

class SchemaDisplacementResponse {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  id_app: string;
}

export default class SyncDisplacementResponseSwagger {
  @ApiProperty({
    type: SchemaDisplacementResponse,
    isArray: true,
  })
  created: SchemaDisplacementResponse[];
  @ApiProperty({
    type: 'boolean',
  })
  sync: boolean;
}
