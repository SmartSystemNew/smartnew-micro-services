import { Prisma, smartnewsystem_compras_aprovacao } from '@prisma/client';
import IBuyApprobation from 'src/models/IBuyApprobation';

export default abstract class BuyApprobationRepository {
  abstract findByBuyAndUser(
    buyId: number,
    user: string,
  ): Promise<smartnewsystem_compras_aprovacao | null>;
  abstract listByUserAndOpen(
    user: string,
  ): Promise<smartnewsystem_compras_aprovacao[]>;
  abstract findById(buyId: number): Promise<IBuyApprobation['findById'] | null>;
  abstract listByBuy(buyId: number): Promise<IBuyApprobation['listByBuy'][]>;
  abstract listByBranches(
    branches: number[],
    login: string,
    blank: string,
    nivel: number,
    index: number,
    perPage: number,
    filter?: Prisma.smartnewsystem_compras_aprovacaoWhereInput,
  ): Promise<IBuyApprobation['listByBranches'][]>;

  abstract listByBranchesAndLogin(
    branches: number[],
    login: string,
    blank: string,
    index: number,
    perPage: number,
    filter?: Prisma.smartnewsystem_compras_aprovacaoWhereInput,
  ): Promise<IBuyApprobation['listByBranchesAndLogin'][]>;

  abstract countListByBranchesAndLogin(
    branches: number[],
    login: string,
    filter?: Prisma.smartnewsystem_compras_aprovacaoWhereInput,
  ): Promise<number>;

  abstract everyoneApprovedBeforeMe(
    branchId: number,
    nivel: number,
    blank: string,
    login: string,
    buyId: number,
  ): Promise<boolean>;

  abstract listByBranchesLastNivel(
    branches: number[],
    login: string,
    index: number,
    perPage: number,
    filter?: Prisma.smartnewsystem_compras_aprovacaoWhereInput,
  ): Promise<IBuyApprobation['listByBranchesLastNivel'][]>;

  abstract create(
    data: Prisma.smartnewsystem_compras_aprovacaoUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_aprovacao>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_compras_aprovacaoUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_aprovacao>;

  abstract updateRequest(
    clientId: number,
    login: string,
    ids: number[],
    approved: boolean,
    justify: string,
    signature: string,
    hasFinance: boolean,
  ): Promise<{ error: boolean; message: string }>;

  abstract updateMany(
    id: number[],
    data: Prisma.smartnewsystem_compras_aprovacaoUncheckedUpdateInput,
  ): Promise<boolean>;

  abstract delete(id: number): Promise<boolean>;
}
