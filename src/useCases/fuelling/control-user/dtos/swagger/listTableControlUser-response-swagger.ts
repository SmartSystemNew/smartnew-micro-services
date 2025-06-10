import { ApiProperty } from '@nestjs/swagger';

class DataSelect {
  @ApiProperty()
  value: string;

  @ApiProperty()
  label: string;
}

class controlUserData {
  @ApiProperty({ type: 'number' })
  id: number;

  @ApiProperty({ type: 'string' })
  type: string;

  @ApiProperty({ type: 'string' })
  password: string;

  @ApiProperty({ type: DataSelect })
  user: {
    value: string;
    label: string;
  };

  @ApiProperty({ type: DataSelect, nullable: true })
  train: {
    value: string;
    label: string;
  } | null;
}

export default class listTableControlUserResponseSwagger {
  @ApiProperty({
    isArray: true,
    type: controlUserData,
    example: [
      {
        id: 0,
        user: {
          value: 'login',
          label: 'Nome',
        },
        type: 'Motorista',
        password: '*****',
        train: {
          value: 'id do comboio',
          label: 'comboio - placa do comboio',
        },
      },
    ],
  })
  data: controlUserData[];
}
