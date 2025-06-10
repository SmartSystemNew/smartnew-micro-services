import { ApiProperty } from '@nestjs/swagger';

class Response {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  description: string;
}

export default class DefaultResponseSwagger {
  @ApiProperty({
    type: Response,
    isArray: true,
  })
  data: {
    id: string;
    description: string;
  }[];
}
