import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';

class ListDiscount {
  @ApiProperty({ type: 'number' })
  id: number;

  @ApiProperty({ type: 'string' })
  description: string;

  @ApiProperty({ type: 'string' })
  type: $Enums.smartnewsystem_financeiro_registro_tributo_tipo;

  @ApiProperty({ type: 'number' })
  value: number;
}

export class ListDiscountResponse {
  @ApiProperty({ type: [ListDiscount] })
  discounts: ListDiscount[];

  @ApiProperty({ type: 'boolean' })
  success: boolean;
}
