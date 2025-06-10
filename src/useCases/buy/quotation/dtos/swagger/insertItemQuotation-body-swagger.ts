import { ApiProperty } from '@nestjs/swagger';

export default class InsertItemQuotationBodySwagger {
  @ApiProperty({
    type: 'number',
    required: true,
  })
  itemId: number;

  @ApiProperty({
    type: 'number',
  })
  providerId: number;

  @ApiProperty({
    type: 'number',
  })
  quantity: number;

  @ApiProperty({
    type: 'number',
    nullable: true,
  })
  observation: string | null;

  @ApiProperty({
    type: 'number',
  })
  price: number;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  reason: string | null;

  @ApiProperty({
    type: 'boolean',
    nullable: true,
  })
  blockInProvider: boolean | null;
}
