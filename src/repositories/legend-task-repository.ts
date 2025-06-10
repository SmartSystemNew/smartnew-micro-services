import { sofman_legenda_tarefas, Prisma } from '@prisma/client';

export default abstract class LegendTaskRepository {
  abstract listByClient(
    clientId: number,
    filter?: Prisma.sofman_legenda_tarefasWhereInput | null,
  ): Promise<sofman_legenda_tarefas[]>;

  abstract create(
    data: Prisma.sofman_legenda_tarefasUncheckedCreateInput,
  ): Promise<sofman_legenda_tarefas>;

  abstract update(
    id: number,
    data: Prisma.sofman_legenda_tarefasUncheckedUpdateInput,
  ): Promise<sofman_legenda_tarefas>;

  abstract delete(id: number): Promise<boolean>;
}
