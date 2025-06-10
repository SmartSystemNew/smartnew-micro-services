import { ApiProperty } from '@nestjs/swagger';

export default class CreateAttachmentBodySwagger {
  @ApiProperty({
    description: `Sincronizar apenas imagens(.png, .jpeg,.jpg)`,
    required: true,
    example: 'file.xlsx',
    type: String,
    format: 'binary',
  })
  file: Express.Multer.File;
}
