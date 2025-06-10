import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';

class CategoryMaterial {
  @ApiProperty({ type: 'number' })
  id: number;

  @ApiProperty({ type: 'string' })
  name: string;
}

class AdditionalMaterial {
  @ApiProperty({ type: 'number' })
  ncm_code: number;

  @ApiProperty({ type: 'string' })
  secondary_code: string;

  @ApiProperty({ type: 'boolean' })
  with_branch: boolean;

  @ApiProperty({ type: CategoryMaterial, nullable: true })
  branch: {
    id: number;
    name: string;
  };
}

class ListMaterialService {
  @ApiProperty({ type: 'number' })
  id: number;

  @ApiProperty({ type: 'string' })
  code: string;

  @ApiProperty({ type: 'string' })
  material: string;

  @ApiProperty({ type: 'string' })
  location: string;

  @ApiProperty({ type: 'string' })
  unity: string;

  @ApiProperty({ type: 'string' })
  user: string;

  @ApiProperty({ type: 'boolean' })
  active: boolean;

  @ApiProperty({ type: 'string' })
  typeMaterial: $Enums.sofman_cad_materiais_tipo;

  @ApiProperty({ type: 'string' })
  observation: string;

  @ApiProperty({ type: CategoryMaterial, nullable: true })
  category: {
    id: number;
    name: string;
  };

  @ApiProperty({ type: AdditionalMaterial })
  additional: {
    ncm_code: number;
    secondary_code: string;
    with_branch: boolean;
    branch: {
      id: number;
      name: string;
    };
  };
}

export default class ListMaterialServiceResponseMaterial {
  @ApiProperty({ type: [ListMaterialService] })
  data: ListMaterialService[];
}
