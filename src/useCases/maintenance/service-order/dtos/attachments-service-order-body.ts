import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AttachmentsServiceOrderBody {
  @ApiProperty()
  file: Express.Multer.File;

  @ApiProperty()
  @IsOptional()
  attachment: Uint8Array | null;

  @ApiProperty()
  @IsOptional()
  nameAttachment?: string | null;

  @ApiProperty()
  @IsOptional()
  sizeAttachment?: string | null;

  @ApiProperty()
  @IsOptional()
  comments?: string | null;
}
