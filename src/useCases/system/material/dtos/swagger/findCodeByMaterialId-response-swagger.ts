import { ApiProperty } from '@nestjs/swagger';

class findCodeByMaterial {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
  })
  code: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  brand: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  specification: string;

  @ApiProperty({
    type: Number,
    nullable: true,
  })
  rating: number;
}

export default class findCodeByMaterialIdResponseSwagger {
  @ApiProperty({
    type: [findCodeByMaterial],
  })
  data: findCodeByMaterial[];
}
