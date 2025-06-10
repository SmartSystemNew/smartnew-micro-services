import { smartnewsystem_contrato_tipo_contrato } from '@prisma/client';

export default abstract class ContractTypeRepository {
  abstract listByClient(
    clientId: number,
  ): Promise<smartnewsystem_contrato_tipo_contrato[]>;

  abstract findById(
    id: number,
  ): Promise<smartnewsystem_contrato_tipo_contrato | null>;
}
