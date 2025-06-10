import { ApiProperty } from '@nestjs/swagger';

class LayoutColumnsConfig {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'number',
  })
  position: number;

  @ApiProperty({
    type: 'boolean',
  })
  visible: boolean;
}

export class LayoutConfig {
  @ApiProperty({
    type: [LayoutColumnsConfig],
  })
  columns: LayoutColumnsConfig[];
}

export default class ListLayoutTableResponseSwagger {
  @ApiProperty({
    type: LayoutConfig,
    nullable: true,
  })
  config: LayoutConfig;
}
