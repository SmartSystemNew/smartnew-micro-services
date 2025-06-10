import { sofman_descricao_planos_prev, Prisma } from '@prisma/client';
import IDescriptionPlan from 'src/models/IDescriptionPlan';

export default abstract class DescriptionPlanRepository {
  abstract listByClient(
    clientId: number,
  ): Promise<sofman_descricao_planos_prev[]>;

  abstract listByClientWithTask(
    clientId: number,
  ): Promise<IDescriptionPlan['listByClientWithTask'][]>;

  abstract create(
    data: Prisma.sofman_descricao_planos_prevUncheckedCreateInput,
  ): Promise<sofman_descricao_planos_prev>;

  abstract findById(id: number): Promise<IDescriptionPlan['findById'] | null>;

  abstract update(
    id: number,
    data: Prisma.sofman_descricao_planos_prevUncheckedUpdateInput,
  ): Promise<sofman_descricao_planos_prev>;

  abstract delete(id: number): Promise<boolean>;
}
