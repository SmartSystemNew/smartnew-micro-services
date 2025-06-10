import { ApiProperty } from '@nestjs/swagger';

export class NoteStopServiceOrderBody {
  @ApiProperty()
  idSectorExecutor?: number | null;
  @ApiProperty()
  idCause?: number | null;
  @ApiProperty()
  idBatch?: number | null;
  @ApiProperty()
  dateEndHour?: Date | null;
  @ApiProperty()
  dateStartHour?: Date | null;
  @ApiProperty()
  comments?: string | null;
  @ApiProperty()
  entrance?: number | null;
}
