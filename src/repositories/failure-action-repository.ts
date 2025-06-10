import { Prisma, sofman_cad_acoes } from '@prisma/client';
import { IFailureAction } from 'src/models/IFailureAction';

export abstract class FailureActionRepository {
  abstract findById(id: number): Promise<IFailureAction['findById'] | null>;

  abstract create(
    data: Prisma.sofman_cad_acoesUncheckedCreateInput,
  ): Promise<sofman_cad_acoes>;

  abstract delete(id: number): Promise<boolean>;

  abstract update(
    id: number,
    data: Prisma.sofman_cad_acoesUncheckedUpdateInput,
  ): Promise<sofman_cad_acoes>;

  abstract listByClient(
    idClient: number,
    filters?: Prisma.sofman_cad_acoesWhereInput | any,
    fields?: string[],
  ): Promise<IFailureAction['listByClient'][]>;
}
