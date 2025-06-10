import { smartnewsystem_compras_responsavel_liberacao } from '@prisma/client';

export default abstract class BuyResponsibleRepository {
  abstract listBranchByUser(
    user: string,
  ): Promise<smartnewsystem_compras_responsavel_liberacao[]>;

  abstract listUserByBranch(
    branchId: number,
  ): Promise<smartnewsystem_compras_responsavel_liberacao[]>;
}
