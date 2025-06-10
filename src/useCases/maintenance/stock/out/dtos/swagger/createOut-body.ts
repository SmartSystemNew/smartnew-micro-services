import { ApiProperty } from '@nestjs/swagger';

export default class CreateOutBodySwagger {
  @ApiProperty({ type: 'number' })
  branchId: number;

  @ApiProperty({ type: 'number' })
  secondaryId: number;

  @ApiProperty({ type: 'Date' })
  date: Date;

  @ApiProperty({ type: 'number' })
  quantity: number;

  @ApiProperty({ type: 'number' })
  value: number;

  @ApiProperty({ type: 'string', nullable: true })
  observation: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  serial: string | null;
}
