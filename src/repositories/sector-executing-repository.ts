import { Prisma, sofman_cad_setor_executante } from '@prisma/client';
import { ISectorExecuting } from 'src/models/ISectorExecuting';

export abstract class SectorExecutingRepository {
  abstract findByClientAndSector(
    clientId: number,
    sector: string,
  ): Promise<ISectorExecuting['findByClientAndSector'] | null>;
  abstract findById(id: number): Promise<ISectorExecuting['findById'] | null>;

  abstract create(
    data: Prisma.sofman_cad_setor_executanteUncheckedCreateInput,
  ): Promise<sofman_cad_setor_executante>;

  abstract delete(id: number): Promise<boolean>;

  abstract listByClient(
    idClient: number,
    filters?: Prisma.sofman_cad_setor_executanteWhereInput | any,
    fields?: string[],
  ): Promise<ISectorExecuting['listByClient'][]>;

  abstract update(
    id: number,
    data: Prisma.sofman_cad_setor_executanteUncheckedUpdateInput,
  ): Promise<sofman_cad_setor_executante>;
}
