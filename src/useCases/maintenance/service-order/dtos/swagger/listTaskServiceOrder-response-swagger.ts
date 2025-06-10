import { ApiProperty } from '@nestjs/swagger';
import { DataSelectResponse } from 'src/models/swagger/select-response-swagger';

export default class ListTaskServiceOrderResponseSwagger {
  @ApiProperty({
    type: 'number',
  })
  id: number;

  @ApiProperty({
    type: 'number',
  })
  periodicity: number;

  @ApiProperty({
    type: 'number',
  })
  minute: number;

  @ApiProperty({
    type: 'string',
    enum: ['Executando', 'Sem Registro', 'Executado'],
  })
  executing: string;

  @ApiProperty({
    type: DataSelectResponse,
    isArray: true,
  })
  task: {
    value: string;
    label: string;
  };

  @ApiProperty({
    type: DataSelectResponse,
    isArray: true,
  })
  status: {
    value: string;
    label: string;
  };

  @ApiProperty({
    type: DataSelectResponse,
    isArray: true,
  })
  unity: {
    value: string;
    label: string;
  };
}
