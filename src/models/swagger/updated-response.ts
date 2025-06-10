import { ApiProperty } from '@nestjs/swagger';

export default class UpdatedResponseSwagger {
  @ApiProperty()
  updated: boolean;
}
