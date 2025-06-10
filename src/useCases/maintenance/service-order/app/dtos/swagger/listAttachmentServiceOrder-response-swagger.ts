import { ApiProperty } from '@nestjs/swagger';

class SchemaListAttachmentServiceOrder {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  service_order_id: string;

  @ApiProperty({
    type: 'string',
  })
  src: string;
}

export default class ListAttachmentServiceOrderResponseSwagger {
  @ApiProperty({
    type: SchemaListAttachmentServiceOrder,
    isArray: true,
  })
  created: SchemaListAttachmentServiceOrder[];

  @ApiProperty({
    type: SchemaListAttachmentServiceOrder,
    isArray: true,
  })
  updated: SchemaListAttachmentServiceOrder[];

  @ApiProperty({
    type: SchemaListAttachmentServiceOrder,
    isArray: true,
  })
  deleted: SchemaListAttachmentServiceOrder[];
}
