import {
  Prisma,
  log_smartnewsystem_manutencao_apontamento_manual,
} from '@prisma/client';

export default abstract class LogMaintenanceAppointmentManualRepository {
  abstract listByBranch(
    branches: number[],
    filter?: Prisma.log_smartnewsystem_manutencao_apontamento_manualWhereInput,
  ): Promise<log_smartnewsystem_manutencao_apontamento_manual[]>;
}
