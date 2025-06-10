import { smartnewsystem_manutencao_controle_estoque } from '@prisma/client';

export default abstract class MaintenanceControlStockRepository {
  abstract listByClient(
    clientId: number,
  ): Promise<smartnewsystem_manutencao_controle_estoque[]>;
}
