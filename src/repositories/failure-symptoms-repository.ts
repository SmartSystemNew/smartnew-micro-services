import { Prisma, sofman_cad_sintomas } from '@prisma/client';
import { IFailureSymptoms } from 'src/models/IFailureSymptoms';

export abstract class FailureSymptomsRepository {
  abstract findById(id: number): Promise<IFailureSymptoms['findById'] | null>;

  abstract create(
    data: Prisma.sofman_cad_sintomasUncheckedCreateInput,
  ): Promise<sofman_cad_sintomas>;

  abstract delete(id: number): Promise<boolean>;

  abstract update(
    id: number,
    data: Prisma.sofman_cad_sintomasUncheckedUpdateInput,
  ): Promise<sofman_cad_sintomas>;

  abstract listByClient(
    idClient: number,
    filters?: Prisma.sofman_cad_sintomasWhereInput | any,
    fields?: string[],
  ): Promise<IFailureSymptoms['listByClient'][]>;
}
