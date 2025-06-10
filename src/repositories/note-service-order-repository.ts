import { Prisma, sofman_apontamento_os } from '@prisma/client';
import { INoteServiceOrder } from 'src/models/INoteServiceOrder';

export abstract class NoteServiceOrderRepository {
  abstract findById(id: number): Promise<INoteServiceOrder['findById'] | null>;

  abstract findByTaskServiceOrder(
    taskServiceId: number,
  ): Promise<sofman_apontamento_os | null>;

  abstract create(
    data: Prisma.sofman_apontamento_osUncheckedCreateInput,
  ): Promise<sofman_apontamento_os>;

  abstract delete(id: number): Promise<boolean>;

  abstract update(
    id: number,
    data: Prisma.sofman_apontamento_osUncheckedUpdateInput,
  ): Promise<sofman_apontamento_os>;

  abstract listByBranches(
    branches: number[],
    filters?: Prisma.sofman_apontamento_osWhereInput | any,
    fields?: string[],
  ): Promise<INoteServiceOrder['listByBranches'][]>;

  abstract listByClient(
    idClient: number,
    filters?: Prisma.sofman_apontamento_osWhereInput | any,
    fields?: string[],
  ): Promise<INoteServiceOrder['listByClient'][]>;
}
