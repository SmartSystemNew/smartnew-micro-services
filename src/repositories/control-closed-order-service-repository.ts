import { smartnewsystem_manutencao_controle_fechamento_ordem_servico } from '@prisma/client';

export default abstract class ControlClosedOrderServiceRepository {
  abstract findByClient(
    clientId: number,
  ): Promise<smartnewsystem_manutencao_controle_fechamento_ordem_servico | null>;
}
