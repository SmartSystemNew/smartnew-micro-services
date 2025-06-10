import {
  IBranch,
  IBranchByUser,
  IListByClientAndBranch,
} from 'src/models/IBranch';

export abstract class BranchesByUserRepository {
  abstract listByClientAndUser(
    clientId: number,
    login: string,
  ): Promise<IBranchByUser[]>;

  abstract listByClientAndBranch(
    clientId: number,
    branchId: number,
  ): Promise<IListByClientAndBranch[]>;

  abstract listByClientAndUserForPage(
    clientId: number,
    login: string,
    index: number | null,
    perPage: number | null,
    search?: string | null,
  ): Promise<IBranch['listByClientAndUserForPage'][]>;

  abstract countListByClientAndUserForPage(
    clientId: number,
    login: string,
    search?: string | null,
  ): Promise<number>;
}
