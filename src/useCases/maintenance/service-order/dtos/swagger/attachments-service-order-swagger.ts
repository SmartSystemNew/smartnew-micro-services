import { ApiProperty } from '@nestjs/swagger';

class Data {
  @ApiProperty()
  id: number;
  @ApiProperty()
  idClient?: number | null;
  @ApiProperty()
  idBranch?: number | null;
  @ApiProperty()
  idServiceOrder?: number | null;
  @ApiProperty()
  attachment?: Uint8Array | null;
  @ApiProperty()
  nameAttachment?: string | null;
  @ApiProperty()
  sizeAttachment?: string | null;
  @ApiProperty()
  comments?: string | null;
  @ApiProperty()
  dateLog: string;
  @ApiProperty()
  username?: string | null;
  @ApiProperty()
  url?: string | null;
}

export class AttachmentsServiceOrderSwaggerResponse {
  @ApiProperty({ isArray: true, type: Data })
  data: Data[];
}
