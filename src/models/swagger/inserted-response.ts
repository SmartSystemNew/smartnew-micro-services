import { ApiProperty } from '@nestjs/swagger';

export default class InsertedResponseSwagger {
  @ApiProperty()
  inserted: boolean;
}
