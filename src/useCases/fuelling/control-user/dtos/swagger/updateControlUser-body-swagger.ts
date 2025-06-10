import { ApiProperty } from '@nestjs/swagger';

export enum UserType {
  DRIVER = 'driver',
  SUPPLIER = 'supplier',
}

export default class UpdatedControlUserBodySwagger {
  @ApiProperty({ type: Number, example: 0 })
  branchId: number;

  @ApiProperty({ type: String, example: 'admin' })
  user: string;

  @ApiProperty({
    type: String,
    enum: UserType,
    example: UserType.DRIVER,
  })
  type: 'driver' | 'supplier';

  @ApiProperty({ type: String, example: '123456' })
  password: string;

  @ApiProperty({ type: Number, nullable: true })
  trainId: number | null;
}
