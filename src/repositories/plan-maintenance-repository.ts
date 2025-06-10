import { Prisma, sofman_cad_planos_prev } from '@prisma/client';
import { IPlanMaintenance } from 'src/models/IPlanMaintenance';

export abstract class PlanMaintenanceRepository {
  abstract findById(id: number): Promise<IPlanMaintenance['findById'] | null>;

  abstract create(
    data: Prisma.sofman_cad_planos_prevUncheckedCreateInput,
  ): Promise<sofman_cad_planos_prev>;

  abstract listByPlanDescription(
    planDescription: number,
    filters?: Prisma.sofman_cad_planos_prevWhereInput | any,
    fields?: string[],
  ): Promise<IPlanMaintenance['listByPlanDescription'][]>;
}
