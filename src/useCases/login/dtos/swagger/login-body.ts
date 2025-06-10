import { ApiProperty } from '@nestjs/swagger';

export default class LoginBodySwagger {
  @ApiProperty({
    description: 'Login',
    required: true,
    example: 'teste',
    type: String,
  })
  login: string;

  @ApiProperty({
    description: 'Senha',
    required: true,
    example: 'teste123',
    type: String,
  })
  pass: string;
}
