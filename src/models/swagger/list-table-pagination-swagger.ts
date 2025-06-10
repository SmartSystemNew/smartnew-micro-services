import { ApiProperty } from '@nestjs/swagger';

export default class listTablePaginationSwagger {
  @ApiProperty({
    default: 0,
    description: 'Index da pagina',
    nullable: true,
    type: Number,
  })
  index: string;

  @ApiProperty({
    default: 10,
    description: 'Quantidade de itens por página',
    nullable: true,
    type: Number,
  })
  perPage: string;
}
