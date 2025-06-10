import { smartnewsystem_compras_configuracao } from '@prisma/client';

export default abstract class BuyConfigurationRepository {
  abstract findByClient(
    clientId: number,
  ): Promise<smartnewsystem_compras_configuracao | null>;
}
