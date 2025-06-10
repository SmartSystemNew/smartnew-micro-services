import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

class RelatedMaterial {
  @ApiProperty()
  id: number;
  @ApiProperty()
  code?: string;
  @ApiProperty()
  material: string;
}
class Data {
  @ApiProperty()
  id: number;
  @ApiProperty()
  idClient: number;
  @ApiProperty()
  idBranch: number;
  @ApiProperty()
  idServiceOrder: number;
  @ApiProperty()
  idPlanTask: number;
  @ApiProperty()
  idProgrammingR2: number;
  @ApiProperty()
  idEquipment: number;
  @ApiProperty()
  category: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  idMaterial: number;
  @ApiProperty()
  quantity: Prisma.Decimal;
  @ApiProperty()
  unit: string;
  @ApiProperty()
  valueUnit: Prisma.Decimal;
  @ApiProperty()
  valueTotal: Prisma.Decimal;
  @ApiProperty()
  utilized: string;
  @ApiProperty()
  comments: string;
  @ApiProperty()
  dateUse: Date;
  @ApiProperty()
  serialNumberOld: string;
  @ApiProperty()
  serialNumberNew: string;
  @ApiProperty()
  dateEmission: Date;
  @ApiProperty()
  username: string;
  @ApiProperty()
  idSession: string;
  @ApiProperty({ isArray: false, type: RelatedMaterial })
  relatedMaterial: RelatedMaterial;
}

export class MaterialServiceOrderSwaggerResponse {
  @ApiProperty({ isArray: true, type: Data })
  data: Data[];
}
