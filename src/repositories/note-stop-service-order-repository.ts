import { Prisma, sofman_apontamento_paradas } from '@prisma/client';
import { INoteStopServiceOrder } from '../models/INoteStopServiceOrder';

export abstract class NoteStopServiceOrderRepository {
  abstract findById(
    id: number,
  ): Promise<INoteStopServiceOrder['findById'] | null>;

  abstract create(
    data: Prisma.sofman_apontamento_paradasUncheckedCreateInput,
  ): Promise<sofman_apontamento_paradas>;

  abstract delete(id: number): Promise<boolean>;

  abstract update(
    id: number,
    data: Prisma.sofman_apontamento_paradasUncheckedUpdateInput,
  ): Promise<sofman_apontamento_paradas>;

  abstract listByServiceOrder(
    idServiceOrder: number,
    filters?: Prisma.sofman_apontamento_paradasWhereInput | any,
    fields?: string[],
  ): Promise<INoteStopServiceOrder['listByServiceOrder'][]>;
}
