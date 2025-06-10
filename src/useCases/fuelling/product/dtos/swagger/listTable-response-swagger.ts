import { ApiProperty } from '@nestjs/swagger';

class Product {
  @ApiProperty()
  id: number;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  unity: string;
}

export class listTableProductSwaggerResponse {
  @ApiProperty({ isArray: true, type: Product })
  data: Product[];
}
