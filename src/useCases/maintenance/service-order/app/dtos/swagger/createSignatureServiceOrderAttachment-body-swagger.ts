import { ApiProperty } from '@nestjs/swagger';

class SignatureServiceOrderAttachment {
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
  name_client: string | null;

  @ApiProperty({
    type: 'string',
  })
  name_technic: string | null;

  @ApiProperty({
    type: 'string',
  })
  signed: string | null;

  @ApiProperty({
    type: 'string',
  })
  name_extra: string | null;
}

export default class CreateSignatureServiceOrderAttachmentBodySwagger {
  @ApiProperty({
    type: SignatureServiceOrderAttachment,
  })
  created: SignatureServiceOrderAttachment[];

  @ApiProperty({
    type: SignatureServiceOrderAttachment,
  })
  updated: SignatureServiceOrderAttachment;

  @ApiProperty({
    type: [Number],
  })
  deleted: number[];

  @ApiProperty({
    description: `Sincronizar apenas imagens(.png, .jpeg,.jpg)`,
    required: true,
    example: 'file.xlsx',
    type: String,
    format: 'binary',
  })
  file: Express.Multer.File;
}
