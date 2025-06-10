import { ApiProperty } from '@nestjs/swagger';

export class EquipmentSchema {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tag: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  branch_id: string;
}

export default class ListEquipmentResponseSwagger {
  @ApiProperty({
    type: EquipmentSchema,
    isArray: true,
  })
  data: {
    id: string;
    tag: string;
    description: string;
    branch_id: string;
  }[];
}
