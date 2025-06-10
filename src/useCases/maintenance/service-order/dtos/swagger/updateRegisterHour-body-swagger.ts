import { ApiProperty } from '@nestjs/swagger';

export default class UpdateRegisterHourBodySwagger {
  @ApiProperty({
    type: Date,
  })
  start: Date;

  @ApiProperty({
    type: Date,
  })
  end: Date | null;
}
