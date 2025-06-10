import { ApiProperty } from '@nestjs/swagger';

class RelatedComponent {
  @ApiProperty()
  id: number;
  @ApiProperty()
  component: string;
}
class RelatedFailureSymptoms {
  @ApiProperty()
  id: number;
  @ApiProperty()
  description: string;
}
class RelatedFailureCause {
  @ApiProperty()
  id: number;
  @ApiProperty()
  description: string;
}
class RelatedFailureAction {
  @ApiProperty()
  id: number;
  @ApiProperty()
  description: string;
}
class Data {
  @ApiProperty()
  id: number;
  @ApiProperty()
  idClient?: number;
  @ApiProperty()
  idBranch?: number;
  @ApiProperty()
  idServiceOrder?: number;
  @ApiProperty()
  idFamilyEquipment?: number;
  @ApiProperty()
  idTypeEquipment?: number;
  @ApiProperty()
  idEquipment?: number;
  @ApiProperty()
  idComponent?: number;
  @ApiProperty()
  idSymptom?: number;
  @ApiProperty()
  idCause?: number;
  @ApiProperty()
  idAction?: number;
  @ApiProperty()
  username?: string;
  @ApiProperty()
  dateEmission: Date;
  @ApiProperty({ isArray: false, type: RelatedComponent })
  components: RelatedComponent;
  @ApiProperty({ isArray: false, type: RelatedFailureSymptoms })
  relatedFailureSymptoms: RelatedFailureSymptoms;
  @ApiProperty({ isArray: false, type: RelatedFailureCause })
  relatedFailureCause: RelatedFailureCause;
  @ApiProperty({ isArray: false, type: RelatedFailureAction })
  relatedFailureAction: RelatedFailureAction;
}

export class FailureAnalysisServiceOrderSwaggerResponse {
  @ApiProperty({ isArray: true, type: Data })
  data: Data[];
}
