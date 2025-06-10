import { ApiProperty } from '@nestjs/swagger';

export class updateProductBodySwagger {
  @ApiProperty({ example: 'Gasolina', description: 'Descrição do produto' })
  description: string;

  @ApiProperty({ example: 'Litro', description: 'Unidade do produto' })
  unity: string;
}
