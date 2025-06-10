import { ApiProperty } from '@nestjs/swagger';

class SecondaryCode {
  @ApiProperty({ type: 'string' })
  code: string;

  @ApiProperty({ type: 'string', nullable: true })
  manufacture: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  specification: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  classification: string | null;
}

export default class CreateMaterialBodySwagger {
  @ApiProperty({ type: 'number', nullable: true })
  branch: number | null;

  @ApiProperty({ type: 'string' })
  code: string;

  @ApiProperty({ type: 'string' })
  material: string;

  @ApiProperty({ type: 'number', nullable: true })
  category: number | null;

  @ApiProperty({ type: 'string' })
  unity: string;

  @ApiProperty({ type: 'string', nullable: true })
  location: string | null;

  @ApiProperty({ type: 'number' })
  type_material: string;

  @ApiProperty({ type: 'number', minimum: 1, maximum: 1 })
  min_storage: number;

  @ApiProperty({ type: 'string', nullable: true })
  observation: string | null;

  @ApiProperty({ type: 'number', minimum: 1, maximum: 1 })
  max_storage: number;

  @ApiProperty({ type: 'string', nullable: true })
  ncm_code: string | null;

  @ApiProperty({ type: [SecondaryCode], nullable: true })
  secondary_codes: SecondaryCode[];

  @ApiProperty({ type: 'boolean', nullable: true })
  withBranch: boolean;
}
