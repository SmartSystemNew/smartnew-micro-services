import { ApiProperty } from '@nestjs/swagger';

export default class CreateItemBodySwagger {
  @ApiProperty({ type: 'number' })
  seq: number;

  @ApiProperty({ type: 'number' })
  taskId: number;

  @ApiProperty({ type: 'number' })
  periodicityUse: number;

  @ApiProperty({ type: 'number' })
  valueBase: number;
}
