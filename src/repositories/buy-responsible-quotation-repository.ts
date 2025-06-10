import { smartnewsystem_compras_responsavel_cotacao } from '@prisma/client';

export default abstract class BuyResponsibleQuotationRepository {
  abstract listByClient(
    clientId: number,
  ): Promise<smartnewsystem_compras_responsavel_cotacao[]>;

  abstract listByBranches(
    branches: number[],
  ): Promise<smartnewsystem_compras_responsavel_cotacao[]>;

  abstract listByBranchesAndLogin(
    branches: number[],
    login: string,
  ): Promise<smartnewsystem_compras_responsavel_cotacao[]>;
}
