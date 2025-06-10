import { ApiProperty } from '@nestjs/swagger';

export class createProductBodySwagger {
  @ApiProperty({ example: 'Gasolina', description: 'Descrição do produto' })
  description: string;

  @ApiProperty({ example: 'Litro', description: 'Unidade do produto' })
  unity: string;
}

export class createProductExampleSwagger {
  description: 'Gasolina';
  unity: 'Litro';
}
