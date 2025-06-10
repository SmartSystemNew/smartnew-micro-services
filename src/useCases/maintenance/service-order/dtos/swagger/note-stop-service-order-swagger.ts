import { ApiProperty } from '@nestjs/swagger';

class RelatedServiceOrder {
  @ApiProperty()
  id: number;
  @ApiProperty()
  ordem: string;
}
class RelatedFailureCause {
  @ApiProperty()
  id: number;
  @ApiProperty()
  description: string;
}
class RelatedSectorExecutor {
  @ApiProperty()
  id: number;
  @ApiProperty()
  description: string;
}
class RelatedNoteStopBatch {
  @ApiProperty()
  id: number;
  @ApiProperty()
  comments: string;
}
class RelatedEquipment {
  @ApiProperty()
  id: number;
  @ApiProperty()
  codeEquipment: string;
}
class Data {
  @ApiProperty()
  id: number;

  @ApiProperty()
  dateEndHour?: string | null;
  @ApiProperty()
  dateStartHour?: string | null;
  @ApiProperty()
  comments?: string | null;
  @ApiProperty()
  entrance?: number | null;
  @ApiProperty()
  username?: string | null;
  @ApiProperty()
  dateEmission?: string | null;

  @ApiProperty()
  idEquipment?: number | null;
  @ApiProperty({ isArray: false, type: RelatedEquipment })
  relatedEquipment: RelatedEquipment;

  @ApiProperty()
  idServiceOrder?: number | null;
  @ApiProperty({ isArray: false, type: RelatedServiceOrder })
  relatedServiceOrder: RelatedServiceOrder;

  @ApiProperty()
  idCause?: number | null;
  @ApiProperty({ isArray: false, type: RelatedFailureCause })
  relatedFailureCause: RelatedFailureCause;

  @ApiProperty()
  idSectorExecutor?: number | null;
  @ApiProperty({ isArray: false, type: RelatedSectorExecutor })
  relatedSectorExecutor: RelatedSectorExecutor;

  @ApiProperty()
  idBatch?: number | null;
  @ApiProperty({ isArray: false, type: RelatedNoteStopBatch })
  relatedNoteStopBatch: RelatedNoteStopBatch;
}

export class NoteStopServiceOrderSwaggerResponse {
  @ApiProperty({ isArray: true, type: Data })
  data: Data[];
}
