import { IsOptional } from 'class-validator';

export class InfoTableQuery {
  @IsOptional()
  index: number | null;
  @IsOptional()
  perPage: number | null;
  @IsOptional()
  filterText?: string | undefined;
}
