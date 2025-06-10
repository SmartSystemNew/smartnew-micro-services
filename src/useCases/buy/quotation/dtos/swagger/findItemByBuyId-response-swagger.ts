import { ApiProperty } from '@nestjs/swagger';

class ItemEnable {
  @ApiProperty({
    type: 'number',
  })
  id: number;

  @ApiProperty({
    type: 'number',
  })
  providerId: number;

  @ApiProperty({
    type: 'boolean',
  })
  enable: boolean;
}

class CodeSecondary {
  @ApiProperty({
    type: 'string',
  })
  code: string;

  @ApiProperty({
    type: 'string',
  })
  urlPath: string;
}

class FindItemByBuyId {
  @ApiProperty({
    type: 'number',
  })
  id: number;

  @ApiProperty({
    type: 'string',
  })
  material: string;

  @ApiProperty({
    type: 'string',
  })
  codeNCM: string;

  @ApiProperty({
    type: CodeSecondary,
    nullable: true,
  })
  codeSecondary: CodeSecondary;

  @ApiProperty({
    type: 'number',
  })
  quantity: number;
  observation: string;

  @ApiProperty({
    type: 'number',
  })
  quotation: number;

  @ApiProperty({
    type: [ItemEnable],
  })
  itemEnable: ItemEnable[];
}

export default class FindItemBuyIdResponseSwagger {
  @ApiProperty({
    type: [FindItemByBuyId],
  })
  items: FindItemByBuyId[];

  @ApiProperty({
    type: 'boolean',
  })
  success: boolean;
}
