import { ApiProperty } from '@nestjs/swagger';

export default class CreateControlBodySwagger {
  @ApiProperty({
    description: 'Filtro por dia (número)',
    required: true,
    type: Number,
    minimum: 1,
  })
  filterDay: number;

  @ApiProperty({
    description: 'Modelo do PU (ultima_nota ou media_nota)',
    required: false,
    type: String,
    enum: ['ultima_nota', 'media_nota'],
    nullable: true,
  })
  modelPU?: 'ultima_nota' | 'media_nota' | null;
}
