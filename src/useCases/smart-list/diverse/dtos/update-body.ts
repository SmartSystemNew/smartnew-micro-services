import { IsNotEmpty } from 'class-validator';

export class UpdateBody {
  @IsNotEmpty({
    message: 'Nome é obrigatório!',
  })
  name: string;
}
