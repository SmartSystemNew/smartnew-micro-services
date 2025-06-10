import { ApiProperty } from '@nestjs/swagger';

export class CostServiceOrderBody {
  @ApiProperty()
  idDescriptionCost: number;
  @ApiProperty()
  quantity: string;
  @ApiProperty()
  valueUnit: string;
  @ApiProperty()
  cost: string;
  @ApiProperty()
  dateCost: Date;
  @ApiProperty()
  comments?: string;
}
