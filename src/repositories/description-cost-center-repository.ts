import { Prisma, sofman_descricao_centro_custo } from '@prisma/client';
import { IDescriptionCostCenter } from 'src/models/IDescriptionCostCenter';

export abstract class DescriptionCostCenterRepository {
  abstract listByClient(
    clientId: number,
  ): Promise<IDescriptionCostCenter['listByClient'][]>;

  abstract listByClientComplete(
    clientId: number,
  ): Promise<IDescriptionCostCenter['listByClientComplete'][]>;
  abstract listByBranchesComplete(
    branchId: number[],
  ): Promise<IDescriptionCostCenter['listByBranchesComplete'][]>;

  abstract listByBranch(
    branchId: number,
  ): Promise<IDescriptionCostCenter['listByBranch'][]>;

  abstract findByClientAndBranchAndName(
    clientId: number,
    branchId: number,
    name: string,
  ): Promise<IDescriptionCostCenter['findByBranchAndName'] | null>;
  abstract findById(
    id: number,
  ): Promise<IDescriptionCostCenter['findById'] | null>;

  abstract insert(
    data: Prisma.sofman_descricao_centro_custoUncheckedCreateInput,
  ): Promise<sofman_descricao_centro_custo>;

  abstract update(
    data: Prisma.sofman_descricao_centro_custoUncheckedUpdateInput,
    id: number,
  ): Promise<sofman_descricao_centro_custo>;

  abstract delete(id: number): Promise<boolean>;
}
