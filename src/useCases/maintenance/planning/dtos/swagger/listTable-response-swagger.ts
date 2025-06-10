import { ApiResponseProperty } from '@nestjs/swagger';
import { DataSelectResponse } from 'src/models/swagger/select-response-swagger';

class FamilyTable {
  @ApiResponseProperty({ type: 'number' })
  id: number;

  @ApiResponseProperty({ type: 'string' })
  family: string;

  @ApiResponseProperty({ type: [DataSelectResponse] })
  equipment: {
    value: string;
    label: string;
  }[];

  @ApiResponseProperty({ type: 'string' })
  sectorExecutingId: string;

  @ApiResponseProperty({ type: 'string' })
  typeMaintenanceId: string;

  @ApiResponseProperty({ type: 'string' })
  periodicityId: string;

  @ApiResponseProperty({ type: 'number' })
  valueDefault: number | null;

  @ApiResponseProperty({ type: 'string' })
  description: string;

  @ApiResponseProperty({ type: 'string', enum: ['manual', 'automatico'] })
  type: string;
}

export default class ListTableResponseSwagger {
  @ApiResponseProperty({ type: [FamilyTable] })
  familia: { [key: string]: FamilyTable[] };
}
