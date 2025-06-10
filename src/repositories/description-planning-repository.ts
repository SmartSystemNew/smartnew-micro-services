import {
  Prisma,
  sofman_descricao_planejamento_manutencao,
} from '@prisma/client';
import IDescriptionPlanning from 'src/models/IDescriptionPlanning';

export default abstract class DescriptionPlanningRepository {
  abstract create(
    data: Prisma.sofman_descricao_planejamento_manutencaoUncheckedCreateInput,
  ): Promise<sofman_descricao_planejamento_manutencao>;

  abstract listByBranches(
    branchId: number[],
    index: number | null,
    perPage: number | null,
    filter?: Prisma.sofman_descricao_planejamento_manutencaoWhereInput | null,
  ): Promise<IDescriptionPlanning['listByBranch'][]>;

  abstract findById(
    id: number,
  ): Promise<IDescriptionPlanning['findById'] | null>;

  abstract update(
    id: number,
    data: Prisma.sofman_descricao_planejamento_manutencaoUncheckedUpdateInput,
  ): Promise<sofman_descricao_planejamento_manutencao>;

  abstract delete(id: number): Promise<boolean>;
}
