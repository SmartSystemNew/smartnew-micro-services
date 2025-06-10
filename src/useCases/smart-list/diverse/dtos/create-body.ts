import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBody {
  @IsNotEmpty({
    message: 'Nome é obrigatório!',
  })
  name: string;
  @IsNotEmpty({
    message: 'Filial é obrigatório!',
  })
  @IsNumber()
  branch: number;
}
