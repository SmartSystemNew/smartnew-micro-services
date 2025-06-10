import {
  Prisma,
  smartnewsystem_manutencao_apontamento_manual,
} from '@prisma/client';

export default abstract class MaintenanceAppointmentManualRepository {
  abstract create(
    data: Prisma.smartnewsystem_manutencao_apontamento_manualUncheckedCreateInput,
  ): Promise<smartnewsystem_manutencao_apontamento_manual>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_manutencao_apontamento_manualUncheckedUpdateInput,
  ): Promise<smartnewsystem_manutencao_apontamento_manual>;

  abstract delete(id: number): Promise<boolean>;
}
