import { Prisma } from '@prisma/client';
import ILogMaterial from 'src/models/ILogMaterial';

export default abstract class LogMaterialRepository {
  abstract listByClientAndActive(
    clientId: number,
    filter?: Prisma.log_sofman_cad_materiaisWhereInput | null,
  ): Promise<ILogMaterial['listByClientAndActive'][]>;

  abstract listStock(
    clientId: number,
    log_date: Date,
  ): Promise<ILogMaterial['listStock'][]>;
}
