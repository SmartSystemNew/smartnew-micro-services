import { Prisma } from '@prisma/client';
import ILogNoteStopServiceOrder from 'src/models/ILogNoteStopServiceOrder';

export abstract class LogNoteStopServiceOrderRepository {
  abstract findByMany(
    branches: number[],
    filter?: Prisma.log_sofman_apontamento_paradasWhereInput,
  ): Promise<ILogNoteStopServiceOrder['findById'][] | null>;

  abstract listByServiceOrder(
    idServiceOrder: number,
  ): Promise<ILogNoteStopServiceOrder['listByServiceOrder'] | null>;
}
