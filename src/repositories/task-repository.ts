import { Prisma, sofman_cad_tarefas } from '@prisma/client';
import { ITask } from 'src/models/ITask';

export default abstract class TaskRepository {
  abstract findById(id: number): Promise<ITask['findById'] | null>;
  abstract findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<sofman_cad_tarefas | null>;

  abstract insert(
    data: Prisma.sofman_cad_tarefasUncheckedCreateInput,
  ): Promise<sofman_cad_tarefas>;

  abstract update(
    id: number,
    data: Prisma.sofman_cad_tarefasUncheckedUpdateInput,
  ): Promise<sofman_cad_tarefas>;

  abstract listByClient(
    idClient: number,
    filters?: sofman_cad_tarefas,
    fields?: string[],
  ): Promise<ITask['listByClient'][]>;
}
