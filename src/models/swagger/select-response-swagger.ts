import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class DataSelect {
  @ApiProperty()
  value: string;

  @ApiProperty()
  label: string;
}

export default class SelectResponseSwagger {
  @ApiProperty({
    isArray: true,
    type: DataSelect,
  })
  data: DataSelect[];
}

export class DataSelectResponse {
  @ApiResponseProperty()
  value: string;

  @ApiResponseProperty()
  label: string;
}
