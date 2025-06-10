import { ApiProperty } from '@nestjs/swagger';

export default class CreateRegisterHourBodySwagger {
  @ApiProperty({
    type: Date,
  })
  start: Date;

  @ApiProperty({
    type: Date,
  })
  end: Date | null;
}
