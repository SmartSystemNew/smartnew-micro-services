import { Prisma, sofman_log_funcionamento } from '@prisma/client';

export abstract class LogOperationRepository {
  abstract insert(
    data: Prisma.sofman_log_funcionamentoUncheckedCreateInput,
  ): Promise<sofman_log_funcionamento>;

  abstract createMany(
    data: Prisma.sofman_log_funcionamentoUncheckedCreateInput[],
  ): Promise<Prisma.BatchPayload>;

  abstract findByEquipmentAndRegister(
    equipmentId: number,
    register?: Date | null,
  ): Promise<sofman_log_funcionamento | null>;
}
