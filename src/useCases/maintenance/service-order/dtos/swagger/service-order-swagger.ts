import { ApiProperty } from '@nestjs/swagger';

export class ServiceOrderSwaggerResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  codeServiceOrder: string;
  @ApiProperty()
  dateTimeRequest: Date;
  @ApiProperty()
  dateEmission: Date;
  @ApiProperty()
  equipment: string;
  @ApiProperty()
  descriptionRequest: string;
  @ApiProperty()
  closed: string;
  @ApiProperty()
  dateExpectedEnd: Date | null;
  @ApiProperty()
  dateEnd: Date | null;
  @ApiProperty()
  username: string;
  @ApiProperty()
  emission: string | null;
  @ApiProperty()
  openTime: string;
  @ApiProperty()
  datePrev: Date;
  @ApiProperty()
  justification: string | null;
  @ApiProperty()
  status: string;
}
