import { ApiProperty } from '@nestjs/swagger';

class relatedPlanXBranch {
  @ApiProperty()
  id_filial: number;
}
class relatedSubGroup {
  @ApiProperty()
  id: number;
}
class relatedFamilyEquipment {
  @ApiProperty()
  ID: number;
}

class PlanDescriptionSwaggerData {
  @ApiProperty()
  id: number;
  @ApiProperty()
  idClient: number;
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
  @ApiProperty()
  dateEmission: Date;
  @ApiProperty()
  userLogin: string;
  @ApiProperty({ isArray: false, type: relatedFamilyEquipment })
  relatedFamilyEquipment: relatedFamilyEquipment;
  @ApiProperty({ isArray: false, type: relatedSubGroup })
  relatedSubGroup: relatedSubGroup;
  @ApiProperty({ isArray: true, type: relatedPlanXBranch })
  relatedPlanXBranch: relatedPlanXBranch[];
}

export class PlanDescriptionSwaggerResponse {
  @ApiProperty({ isArray: true, type: PlanDescriptionSwaggerData })
  data: PlanDescriptionSwaggerData[];
}
