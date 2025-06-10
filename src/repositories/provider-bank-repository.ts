import { smartnewsystem_fornecedor_banco } from '@prisma/client';

export default abstract class ProviderBankRepository {
  abstract listByClient(
    clientId: number,
  ): Promise<smartnewsystem_fornecedor_banco[]>;

  abstract listByClientAndDefault(
    clientId: number,
  ): Promise<smartnewsystem_fornecedor_banco[]>;
}
