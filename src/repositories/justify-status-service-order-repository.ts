import { sofman_justificativa_status, Prisma } from '@prisma/client';

export default abstract class JustifyStatusServiceOrderRepository {
  abstract findById(id: number): Promise<sofman_justificativa_status | null>;

  abstract create(
    data: Prisma.sofman_justificativa_statusCreateInput,
  ): Promise<sofman_justificativa_status>;

  abstract update(
    id: number,
    data: Prisma.sofman_justificativa_statusUncheckedUpdateInput,
  ): Promise<sofman_justificativa_status>;

  abstract delete(id: number): Promise<boolean>;
}
