import {
  Prisma,
  smartnewsystem_manutencao_tarefas_retorno,
} from '@prisma/client';

export default abstract class TaskServiceOrderReturnRepository {
  abstract findById(
    id: number,
  ): Promise<smartnewsystem_manutencao_tarefas_retorno | null>;
  abstract findByTaskServiceTask(
    taskServiceOrderId: number,
    taskId: number,
    filter?: Prisma.smartnewsystem_manutencao_tarefas_retornoWhereInput | null,
  ): Promise<smartnewsystem_manutencao_tarefas_retorno[]>;

  abstract create(
    data: Prisma.smartnewsystem_manutencao_tarefas_retornoUncheckedCreateInput,
  ): Promise<smartnewsystem_manutencao_tarefas_retorno>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_manutencao_tarefas_retornoUncheckedUpdateInput,
  ): Promise<smartnewsystem_manutencao_tarefas_retorno>;

  abstract delete(id: number): Promise<boolean>;
}
