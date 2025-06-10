import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

class RelatedDescriptionCostServiceOrder {
  id: number;
  description: string;
  unit: string;
}
class Data {
  @ApiProperty()
  id: number;
  @ApiProperty()
  idServiceOrder: number;
  @ApiProperty()
  idDescriptionCost: number;
  @ApiProperty()
  quantity: Prisma.Decimal;
  @ApiProperty()
  valueUnit: Prisma.Decimal;
  @ApiProperty()
  cost: Prisma.Decimal;
  @ApiProperty()
  dateCost: Date;
  @ApiProperty()
  comments: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  dateEmission: Date;
  @ApiProperty({ isArray: false, type: RelatedDescriptionCostServiceOrder })
  relatedDescriptionCostServiceOrder: RelatedDescriptionCostServiceOrder;
}

export class CostServiceOrderSwaggerResponse {
  @ApiProperty({ isArray: true, type: Data })
  data: Data[];
}
