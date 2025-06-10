import { Prisma, sofman_cad_causas } from '@prisma/client';
import { IFailureCause } from 'src/models/IFailureCause';

export abstract class FailureCauseRepository {
  abstract findById(id: number): Promise<IFailureCause['findById'] | null>;

  abstract create(
    data: Prisma.sofman_cad_causasUncheckedCreateInput,
  ): Promise<sofman_cad_causas>;

  abstract delete(id: number): Promise<boolean>;

  abstract update(
    id: number,
    data: Prisma.sofman_cad_causasUncheckedUpdateInput,
  ): Promise<sofman_cad_causas>;

  abstract listByClient(
    idClient: number,
    filters?: Prisma.sofman_cad_causasWhereInput | any,
    fields?: string[],
  ): Promise<IFailureCause['listByClient'][]>;
}
