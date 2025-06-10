import { ApiProperty } from '@nestjs/swagger';

class SchemaTaskReturnResponse {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  id_app: string;
}

export default class SyncTaskReturnResponseSwagger {
  @ApiProperty({
    type: SchemaTaskReturnResponse,
    isArray: true,
  })
  created: SchemaTaskReturnResponse[];
  @ApiProperty({
    type: 'boolean',
  })
  sync: boolean;
}
