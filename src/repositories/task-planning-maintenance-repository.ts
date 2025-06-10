import { sofman_tarefas_planejamento_manutencao, Prisma } from '@prisma/client';

export default abstract class TaskPlanningMaintenanceRepository {
  abstract findById(
    id: number,
  ): Promise<sofman_tarefas_planejamento_manutencao | null>;
  abstract findByPlanningAndTask(
    planningId: number,
    taskId: number,
  ): Promise<sofman_tarefas_planejamento_manutencao | null>;

  abstract insert(
    data: Prisma.sofman_tarefas_planejamento_manutencaoUncheckedCreateInput,
  ): Promise<sofman_tarefas_planejamento_manutencao>;

  abstract update(
    id: number,
    data: Prisma.sofman_tarefas_planejamento_manutencaoUncheckedUpdateInput,
  ): Promise<sofman_tarefas_planejamento_manutencao>;

  abstract delete(id: number): Promise<boolean>;
}
