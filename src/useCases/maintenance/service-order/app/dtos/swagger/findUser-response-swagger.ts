import { ApiProperty } from '@nestjs/swagger';

class Schema {
  @ApiProperty()
  login: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  company: string;

  @ApiProperty()
  branch_id: string;
}

export default class FindUserResponseSwagger {
  @ApiProperty({
    type: Schema,
  })
  data: {
    login: string;
    name: string;
    company: string;
    branch_id: string;
  }[];
}
