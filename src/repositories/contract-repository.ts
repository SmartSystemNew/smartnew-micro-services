import { Prisma, smartnewsystem_contrato_numero } from '@prisma/client';

export abstract class ContractRepository {
  abstract create(
    data: Prisma.smartnewsystem_contrato_numeroUncheckedCreateInput,
  ): Promise<smartnewsystem_contrato_numero>;

  abstract delete(id: number): Promise<boolean>;
}
