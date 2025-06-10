import { ApiProperty } from '@nestjs/swagger';

export default class DeletedResponseSwagger {
  @ApiProperty()
  deleted: boolean;
}
