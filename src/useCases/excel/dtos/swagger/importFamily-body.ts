import { ApiProperty } from '@nestjs/swagger';
import { ENVService } from 'src/service/env.service';

export default class ImportFamilyBodySwagger {
  private static path =
    new ENVService().URL + 'uploads/excel/template_familia.xlsx';

  @ApiProperty({
    description: 'Código do cliente',
    required: true,
    example: '123',
    type: Number,
  })
  clientId: number;

  @ApiProperty({
    description: `Arquivo Excel (.xlsx, .xls) para importação. [Baixar arquivo de exemplo](${ImportFamilyBodySwagger.path})`,
    required: true,
    example: 'file.xlsx',
    type: String,
    format: 'binary',
  })
  file: Express.Multer.File;
}
