import { sofman_cad_planos_prev } from '@prisma/client';

export default abstract class PreventivePlanRepository {
  abstract listByPlan(planId: number): Promise<sofman_cad_planos_prev[]>;
}
