import { Prisma, smartnewsystem_contrato_dados } from '@prisma/client';

export abstract class ContractItemRepository {
  abstract create(
    data: Prisma.smartnewsystem_contrato_dadosUncheckedCreateInput,
  ): Promise<smartnewsystem_contrato_dados>;
}
