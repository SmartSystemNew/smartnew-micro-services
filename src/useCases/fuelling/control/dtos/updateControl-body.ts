import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export default class UpdateControlBody {
  @IsNumber()
  filterDay: number;

  @IsEnum(['ultima_nota', 'media_nota'], {
    message:
      'Modelo informado incorreto, passe apenas esses : `ultima_nota, media_nota`',
  })
  @IsOptional()
  modelPU?: 'ultima_nota' | 'media_nota' | null;
}
