import { smartnewsystem_registro_turno } from '@prisma/client';

export default abstract class RegisterTurnRepository {
  abstract listByBranch(
    branchId: number,
  ): Promise<smartnewsystem_registro_turno[]>;
}
