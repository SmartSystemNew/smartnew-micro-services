import { ApiProperty } from '@nestjs/swagger';

export default class CreateSecondaryCodeMaterialBodySwagger {
  @ApiProperty({
    type: String,
  })
  code: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  brand: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  specification: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  rating: number | null;

  @ApiProperty({
    type: Number,
    nullable: true,
  })
  min_storage: number | null;

  @ApiProperty({
    type: Number,
    nullable: true,
  })
  max_storage: number | null;
}
