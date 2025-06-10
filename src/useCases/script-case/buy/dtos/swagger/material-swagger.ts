import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

class Data {
  @ApiProperty()
  id: number;
  @ApiProperty()
  idClient: number;
  @ApiProperty()
  idBranch: number;
  @ApiProperty()
  idCategory?: number;
  @ApiProperty()
  code?: string;
  @ApiProperty()
  material: string;
  @ApiProperty()
  unit: string;
  @ApiProperty()
  active: number;
  @ApiProperty()
  value: Prisma.Decimal;
  @ApiProperty()
  valueSales: Prisma.Decimal;
  @ApiProperty()
  factors: Prisma.Decimal;
  @ApiProperty()
  stockMin?: Prisma.Decimal;
  @ApiProperty()
  stockMax?: Prisma.Decimal;
  @ApiProperty()
  stockCurrency: Prisma.Decimal;
  @ApiProperty()
  location?: string;
  @ApiProperty()
  dateEmission: Date;
  @ApiProperty()
  idSession?: string;
  @ApiProperty()
  dateStockMin?: Date;
}

export class MaterialSwaggerResponse {
  @ApiProperty({ isArray: true, type: Data })
  data: Data[];
}
