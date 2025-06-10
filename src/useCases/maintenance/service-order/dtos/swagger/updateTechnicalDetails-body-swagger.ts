import { ApiProperty } from '@nestjs/swagger';

export default class updateTechnicalDetailsBodySwagger {
  @ApiProperty({
    type: String,
    required: false,
    description: 'Diagnóstico do manutenção',
    nullable: true,
  })
  maintenanceDiagnosis: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Solução do problema',
    nullable: true,
  })
  solution: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Observações do executor',
    nullable: true,
  })
  executorObservation: string;

  @ApiProperty({
    type: Date,
    required: false,
    description: 'Data acionamento tecnico',
    nullable: true,
  })
  technicalDrive: Date;

  @ApiProperty({
    type: Date,
    required: false,
    description: 'Chegada tecnico',
    nullable: true,
  })
  technicalArrival: Date;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'Nota de avaliação técnica',
    nullable: true,
  })
  serviceEvaluationNote: number;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'Prioridade do servico',
    nullable: true,
  })
  priority: number;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'Classificação do servico',
    nullable: true,
  })
  classification: number;
}
