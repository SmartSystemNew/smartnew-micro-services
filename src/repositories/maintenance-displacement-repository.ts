import { Prisma, smartnewsystem_manutencao_deslocamento } from '@prisma/client';
import IMaintenanceDisplacement from 'src/models/IMaintenanceDisplacement';

export default abstract class MaintenanceDisplacementRepository {
  abstract listByOrder(
    orderById: number,
  ): Promise<IMaintenanceDisplacement['listByOrder'][]>;

  abstract listByBranches(
    branches: number[],
  ): Promise<IMaintenanceDisplacement['listByBranches'][]>;

  abstract listByServiceOrder(
    id: number[],
  ): Promise<IMaintenanceDisplacement['listByServiceOrder'][]>;

  abstract create(
    data: Prisma.smartnewsystem_manutencao_deslocamentoUncheckedCreateInput,
  ): Promise<smartnewsystem_manutencao_deslocamento>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_manutencao_deslocamentoUncheckedUpdateInput,
  ): Promise<smartnewsystem_manutencao_deslocamento>;

  abstract delete(id: number): Promise<boolean>;
}
