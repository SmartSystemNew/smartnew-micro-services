import { ApiResponseProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { DataSelectResponse } from 'src/models/swagger/select-response-swagger';

class ItemPlanning {
  @ApiResponseProperty({ type: 'number' })
  id: number;

  @ApiResponseProperty({ type: 'number' })
  seq: number;

  @ApiResponseProperty({ type: 'number' })
  periodicityUse: Decimal;

  @ApiResponseProperty({ type: 'number' })
  valueBase: Decimal;

  @ApiResponseProperty({
    type: [DataSelectResponse],
  })
  task: {
    value: string;
    label: string;
  };
}

export default class FindByIdResponseSwagger {
  @ApiResponseProperty({ type: 'number' })
  id: number;

  @ApiResponseProperty({
    type: [DataSelectResponse],
  })
  equipment: {
    value: string;
    label: string;
  }[];

  @ApiResponseProperty({
    type: 'string',
  })
  sectorExecutingId: string;

  @ApiResponseProperty({
    type: 'string',
  })
  typeMaintenanceId: string;

  @ApiResponseProperty({
    type: 'string',
  })
  periodicityId: string;

  @ApiResponseProperty({
    type: 'number',
  })
  valueDefault: number;

  @ApiResponseProperty({
    type: 'string',
  })
  description: string;

  @ApiResponseProperty({
    enum: ['manual', 'automatico'],
  })
  type: $Enums.sofman_descricao_planejamento_manutencao_processamento;

  @ApiResponseProperty({ type: [ItemPlanning] })
  item: ItemPlanning[];
}
