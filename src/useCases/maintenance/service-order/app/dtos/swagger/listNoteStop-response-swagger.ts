import { ApiProperty } from '@nestjs/swagger';

class SchemaListNoteStop {
  @ApiProperty({ example: '123', description: 'ID do apontamento de parada' })
  id: string;

  @ApiProperty({ example: '456', description: 'ID da ordem de serviço' })
  service_order_id: string;

  @ApiProperty({
    example: '2024-03-11T12:00:00.000Z',
    nullable: true,
    description: 'Data e hora do início do trabalho',
  })
  date_worked: string | null;

  @ApiProperty({
    example: '2024-03-11T15:00:00.000Z',
    nullable: true,
    description: 'Data e hora da parada',
  })
  date_stop: string | null;

  @ApiProperty({
    example: 'Parada para manutenção.',
    description: 'Observações sobre a parada',
  })
  observations: string;
}

export default class ListNoteStopResponseSwagger {
  @ApiProperty({
    type: SchemaListNoteStop,
    isArray: true,
    description: 'Lista de registros criados',
  })
  created: SchemaListNoteStop[];

  @ApiProperty({
    type: SchemaListNoteStop,
    isArray: true,
    description: 'Lista de registros atualizados',
  })
  updated: SchemaListNoteStop[];

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'Lista de IDs dos registros deletados',
  })
  deleted: string[];
}
