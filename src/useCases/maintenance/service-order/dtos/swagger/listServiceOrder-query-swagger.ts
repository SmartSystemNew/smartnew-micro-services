import { ApiProperty } from '@nestjs/swagger';

export default class listServiceOrderQuerySwagger {
  @ApiProperty({
    default: 0,
    description: 'Index da pagina',
    type: Number,
    required: false,
  })
  index: string;

  @ApiProperty({
    default: 10,
    description: 'Quantidade de itens por página',
    type: Number,
    required: false,
  })
  perPage: string;
  @ApiProperty({
    type: String,
    description: 'Código da ordem de serviço',
    required: false,
  })
  codeServiceOrder?: string | null;
  @ApiProperty({
    type: String,
    description: 'Descrição da ordem de serviço',
    required: false,
  })
  descriptionRequest?: string | null;
  @ApiProperty({ type: Date, description: 'Data Solicitação', required: false })
  dateTimeRequest?: Date | null;
  @ApiProperty({
    type: Date,
    description: 'Data Previsão Termino',
    required: false,
  })
  dateExpectedEnd?: Date | null;
  @ApiProperty({ type: Date, description: 'Data Emissão', required: false })
  dateEmission?: Date | null;
  @ApiProperty({ type: String, description: 'Solicitante', required: false })
  requester?: string | null;
  @ApiProperty({ type: String, description: 'Id Equipamento', required: false })
  equipment?: string | null;
  @ApiProperty({ type: String, description: 'Justificativa', required: false })
  justification?: string | null;
  @ApiProperty({ type: String, description: 'Status', required: false })
  status?: string | null;
  @ApiProperty({ type: String, description: 'Status Os', required: false })
  statusOS: string | null;
  @ApiProperty({
    type: [Number],
    description: 'Tipo de Manutenção',
    required: false,
  })
  typeMaintenance: number[];
  @ApiProperty({ type: [Number], description: 'Filial', required: false })
  branch: number[];
  @ApiProperty({
    type: [Number],
    description: 'Família Equipamento',
    required: false,
  })
  family: number[];
  @ApiProperty({
    type: [Number],
    description: 'Tipo Equipamento',
    required: false,
  })
  typeEquipment: number[];
  @ApiProperty({ type: String, description: 'Localizacao', required: false })
  location: string | null;
  @ApiProperty({
    type: [Number],
    description: 'Ordem de Servico vinculada',
    required: false,
  })
  orderBound: number[];
  @ApiProperty({ type: String, description: 'Observacao', required: false })
  comments: string | null;
  @ApiProperty({
    type: String,
    description: 'Observacoes Executando',
    required: false,
  })
  observationsExecuting: string | null;
  @ApiProperty({
    type: String,
    description: 'Observacao Cliente',
    required: false,
  })
  clientComments: string | null;
  @ApiProperty({
    type: Number,
    description: 'Nota Avalicao Servico',
    required: false,
  })
  noteEvaluationService: number | null;
  failureStatus: number[];
  causeReason: number[];
  technicalActivationDate: Date | null;
  technicianArrival: Date | null;
}
