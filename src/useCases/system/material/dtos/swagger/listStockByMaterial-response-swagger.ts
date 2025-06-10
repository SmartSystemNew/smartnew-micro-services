import { ApiProperty } from '@nestjs/swagger';

class SchemaStockMaterial {
  @ApiProperty({
    type: 'number',
  })
  price: number;

  @ApiProperty({
    type: 'number',
  })
  quantity: number;
}

export default class ListStockByMaterialResponseSwagger {
  @ApiProperty({
    type: SchemaStockMaterial,
    isArray: true,
  })
  stock: SchemaStockMaterial[];
}
