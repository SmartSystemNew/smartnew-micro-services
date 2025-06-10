import { ApiProperty } from '@nestjs/swagger';

export default class CreateBoundChecklistBodySwagger {
  @ApiProperty({
    description: 'ID do modelo do checklist',
    type: Number,
  })
  modelId: number;

  @ApiProperty({
    description: 'ID do equipamento',
    type: Number,
    required: false,
  })
  equipmentId: number;

  @ApiProperty({
    description: 'ID da Diverso',
    type: Number,
    required: false,
  })
  locationId: number;

  @ApiProperty({
    description: 'ID do Turno',
    type: Number,
    required: false,
  })
  periodId: number;

  @ApiProperty({
    description: 'Horimetro do veículo',
    type: Number,
    required: false,
  })
  hourMeter: number;

  @ApiProperty({
    description: 'Odômetro do veículo',
    type: Number,
    required: false,
  })
  odometer: number;

  @ApiProperty({
    description: 'Kilometragem do veículo',
    type: Number,
    required: false,
  })
  kilometer: number;
}
