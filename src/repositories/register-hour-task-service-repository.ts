import { Prisma, smartnewsystem_registro_hora_tarefa } from '@prisma/client';

export default abstract class RegisterHourTaskServiceRepository {
  abstract findByWhere(
    where: Prisma.smartnewsystem_registro_hora_tarefaWhereInput,
  ): Promise<smartnewsystem_registro_hora_tarefa | null>;
  abstract findById(
    id: number,
  ): Promise<smartnewsystem_registro_hora_tarefa | null>;
  abstract create(
    data: Prisma.smartnewsystem_registro_hora_tarefaUncheckedCreateInput,
  ): Promise<smartnewsystem_registro_hora_tarefa>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_registro_hora_tarefaUncheckedUpdateInput,
  ): Promise<smartnewsystem_registro_hora_tarefa>;

  abstract delete(id: number): Promise<boolean>;

  abstract deleteByTask(taskId: number): Promise<boolean>;
}
