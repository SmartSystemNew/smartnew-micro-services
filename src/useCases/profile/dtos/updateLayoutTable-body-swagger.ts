import { ApiProperty } from '@nestjs/swagger';

class LayoutColumnsConfig {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  id: string;

  @ApiProperty({
    type: 'number',
    required: true,
  })
  position: number;

  @ApiProperty({
    type: 'boolean',
    required: true,
  })
  visible: boolean;
}

export class LayoutConfig {
  columns: LayoutColumnsConfig[];
}

export default class UpdateLayoutTableBodySwagger {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  screenName: string;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  tableName: string;

  @ApiProperty({
    type: [LayoutConfig],
    description: 'Layout configuration',
    required: true,
  })
  config: LayoutConfig[];
}
