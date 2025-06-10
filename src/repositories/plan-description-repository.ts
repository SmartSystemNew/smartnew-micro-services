import { Prisma, sofman_descricao_planos_prev } from '@prisma/client';
import { IPlanDescription } from 'src/models/IPlanDescription';

export abstract class PlanDescriptionRepository {
  abstract findById(id: number): Promise<IPlanDescription['findById'] | null>;

  abstract create(
    data: Prisma.sofman_descricao_planos_prevUncheckedCreateInput,
  ): Promise<sofman_descricao_planos_prev>;

  abstract delete(id: number): Promise<boolean>;

  abstract update(
    id: number,
    data: Prisma.sofman_descricao_planos_prevUncheckedUpdateInput,
  ): Promise<sofman_descricao_planos_prev>;

  abstract listByBranches(
    branches: number[],
    filters?: Prisma.sofman_descricao_planos_prevWhereInput | any,
    fields?: string[],
  ): Promise<IPlanDescription['listByBranches'][]>;

  abstract listByClient(
    idClient: number,
    filters?: Prisma.sofman_descricao_planos_prevWhereInput | any,
    fields?: string[],
  ): Promise<IPlanDescription['listByClient'][]>;
}
