import { Prisma } from '@prisma/client';
import ILogMaterialServiceOrder from 'src/models/ILogMaterialServiceOrder';

export default abstract class LogMaterialServiceOrderRepository {
  abstract listLogMaterialOrder(
    branches: number[],
    filter?: Prisma.log_sofman_materiais_ordem_servicoWhereInput | null,
  ): Promise<ILogMaterialServiceOrder['listLogMaterialOrder'][]>;
}
