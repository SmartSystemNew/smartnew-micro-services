import { smartnewsystem_contrato_status_contrato } from '@prisma/client';

export abstract class ContractStatusRepository {
  abstract findOpen(
    clientId: number,
  ): Promise<smartnewsystem_contrato_status_contrato | null>;
}
