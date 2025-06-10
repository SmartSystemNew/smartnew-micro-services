import { ApiProperty } from '@nestjs/swagger';

export default class CreateTaskServiceOrderSwagger {
  @ApiProperty({
    type: 'number',
  })
  taskId: number;

  @ApiProperty({
    type: 'number',
    nullable: true,
  })
  status: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
  })
  executing: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
  })
  minute: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
  })
  unity: number;
}
