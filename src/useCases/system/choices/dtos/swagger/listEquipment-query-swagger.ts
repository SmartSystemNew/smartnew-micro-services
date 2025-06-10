import { ApiProperty } from '@nestjs/swagger';

export default class listEquipmentQuerySwagger {
  @ApiProperty({
    type: String,
    description: 'Id Familia (string de números separados por vírgula)',
    required: false,
    pattern: '^[0-9]+(,[0-9]+)*$',
  })
  familyId?: string;
}
