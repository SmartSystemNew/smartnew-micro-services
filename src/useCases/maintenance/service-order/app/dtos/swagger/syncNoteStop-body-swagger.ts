import { ApiProperty } from '@nestjs/swagger';

class SchemaSyncNoteStop {
  @ApiProperty({ example: '123', description: 'ID do apontamento de parada' })
  id: string;

  @ApiProperty({
    example: '456',
    description: 'ID da ordem de serviço (opcional)',
    required: false,
  })
  service_order_id?: string;

  @ApiProperty({
    example: '2024-03-11T12:00:00.000Z',
    nullable: true,
    description: 'Data e hora do início do trabalho',
    required: false,
  })
  date_worked?: string | null;

  @ApiProperty({
    example: '2024-03-11T15:00:00.000Z',
    nullable: true,
    description: 'Data e hora da parada',
    required: false,
  })
  date_stop?: string | null;

  @ApiProperty({
    example: 'Parada para manutenção.',
    nullable: true,
    description: 'Observações sobre a parada',
    required: false,
  })
  observations?: string | null;
}

export default class SyncNoteStopBodySwagger {
  @ApiProperty({
    type: SchemaSyncNoteStop,
    isArray: true,
    description: 'Lista de registros criados',
  })
  created: SchemaSyncNoteStop[];

  @ApiProperty({
    type: SchemaSyncNoteStop,
    isArray: true,
    description: 'Lista de registros atualizados',
  })
  updated: SchemaSyncNoteStop[];

  @ApiProperty({
    type: 'string',
    isArray: true,
    description: 'Lista de IDs dos registros deletados',
  })
  deleted: string[];
}
