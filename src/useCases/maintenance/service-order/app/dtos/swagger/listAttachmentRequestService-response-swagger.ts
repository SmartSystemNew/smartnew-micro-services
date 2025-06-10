import { ApiProperty } from '@nestjs/swagger';

class SchemaListAttachmentRequestService {
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

export default class ListAttachmentRequestServiceResponseSwagger {
  @ApiProperty({
    type: SchemaListAttachmentRequestService,
    isArray: true,
  })
  created: SchemaListAttachmentRequestService[];

  @ApiProperty({
    type: SchemaListAttachmentRequestService,
    isArray: true,
  })
  updated: SchemaListAttachmentRequestService[];

  @ApiProperty({
    type: SchemaListAttachmentRequestService,
    isArray: true,
  })
  deleted: SchemaListAttachmentRequestService[];
}
