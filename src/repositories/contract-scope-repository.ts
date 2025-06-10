import { smartnewsystem_contrato_escopo_item } from '@prisma/client';

export abstract class ContractScopeRepository {
  abstract findById(id: number): Promise<smartnewsystem_contrato_escopo_item>;
}
