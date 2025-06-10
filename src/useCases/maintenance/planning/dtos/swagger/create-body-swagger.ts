import { ApiProperty } from '@nestjs/swagger';

export default class CreateBodySwagger {
  @ApiProperty({
    type: 'number',
  })
  familyId: number;

  @ApiProperty({
    type: 'number',
    isArray: true,
    items: { type: 'number' },
  })
  equipmentId: number[];

  @ApiProperty({
    type: 'number',
  })
  sectorExecutingId: number;

  @ApiProperty({
    type: 'number',
  })
  typeMaintenanceId: number;

  @ApiProperty({
    type: 'number',
  })
  periodicityId: number;

  @ApiProperty({
    type: 'number',
    nullable: true,
  })
  increment?: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
  })
  valueDefault?: number | null;

  @ApiProperty({
    type: Date,
    nullable: true,
  })
  dateDefault?: number | null;

  @ApiProperty({
    type: 'string',
  })
  description: string;

  @ApiProperty({
    type: 'string',
    enum: ['automatico', 'manual'],
  })
  type: 'automatico' | 'manual';
}
