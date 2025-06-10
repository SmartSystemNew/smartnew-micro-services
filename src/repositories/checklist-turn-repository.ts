import { smartnewsystem_registro_turno, Prisma } from '@prisma/client';

export default abstract class CheckListTurnRepository {
  abstract listByClient(
    clientId: number,
  ): Promise<smartnewsystem_registro_turno[]>;

  abstract findById(id: number): Promise<smartnewsystem_registro_turno | null>;

  abstract create(
    data: Prisma.smartnewsystem_registro_turnoUncheckedCreateInput,
  ): Promise<smartnewsystem_registro_turno>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_registro_turnoUncheckedUpdateInput,
  ): Promise<smartnewsystem_registro_turno>;

  abstract delete(id: number): Promise<boolean>;
}
