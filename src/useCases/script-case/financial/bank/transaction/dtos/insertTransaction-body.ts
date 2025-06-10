import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsNumberString } from 'class-validator';

export default class InsertTransactionBody {
  @ApiProperty()
  @IsNumberString()
  bankOriginId: string;

  @ApiProperty()
  @IsNumberString()
  bankDestinationId: string;

  @ApiProperty()
  @IsNumberString()
  compositionId: string;

  @ApiProperty()
  @IsNumberString()
  branchId: string;

  @ApiProperty()
  @IsNumberString()
  providerId: string;

  @ApiProperty()
  @IsNumberString()
  typePaymentId: string;

  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiProperty()
  @IsDateString()
  date: Date;
}
