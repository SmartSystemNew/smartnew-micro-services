import { ApiProperty } from '@nestjs/swagger';

export class PlanDescriptionBody {
  @ApiProperty()
  idSubGroup: number | null;
  @ApiProperty()
  branch: string;
  @ApiProperty()
  idFamilyEquipe: number;
  @ApiProperty()
  description: string;
  @ApiProperty()
  logo: Buffer | null;
}
