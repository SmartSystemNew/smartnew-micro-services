import { ApiProperty } from '@nestjs/swagger';

export default class ExcelBodySwagger {
  @ApiProperty({
    description: 'Código do cliente',
    required: true,
    example: '123',
    type: Number,
  })
  clientId: number;

  @ApiProperty({
    description: 'Arquivo Excel (.xlsx, .xls) para importação',
    required: true,
    example: 'file.xlsx',
    type: String,
    format: 'binary',
  })
  file: Express.Multer.File;
}
