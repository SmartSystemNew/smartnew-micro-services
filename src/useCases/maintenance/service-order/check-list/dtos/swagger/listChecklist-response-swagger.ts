import { ApiProperty } from '@nestjs/swagger';

export class ListChecklistResponseSwagger {
  @ApiProperty()
  id: number;

  @ApiProperty({
    description: 'Status da checklist',
    enum: ['close', 'open'],
  })
  status: string;

  @ApiProperty({
    description: 'Data de início da checklist',
    type: Date,
  })
  startDate: Date;

  @ApiProperty({
    description: 'Data de término da checklist',
    type: Date,
  })
  endDate: Date;

  @ApiProperty({
    description: 'Modelo do checklist',
    type: String,
  })
  model: string;

  @ApiProperty({
    description: 'Equipamento ou Diverso do checklist',
    type: String,
  })
  item: string;

  @ApiProperty({
    description: 'Criado por:',
    type: String,
  })
  user: string;

  @ApiProperty({
    description: 'Turno do checklist (Optional)',
    type: String,
  })
  period: string;
}
