import { Prisma, log_smartnewsystem_mantenedores_os } from '@prisma/client';
import ILogServiceOrderMaintainer from 'src/models/ILogServiceOrderMaintainer';

export default abstract class LogServiceOrderMaintainerRepository {
  abstract listByMaintainerAndOrders(
    branches: number[],
    filter?: Prisma.log_smartnewsystem_mantenedores_osWhereInput | null,
  ): Promise<ILogServiceOrderMaintainer['listByMaintainerAndOrders'][]>;

  abstract last(
    where?: Prisma.log_smartnewsystem_mantenedores_osWhereInput | null,
  ): Promise<log_smartnewsystem_mantenedores_os>;

  abstract update(
    id: number,
    data: Prisma.log_smartnewsystem_mantenedores_osUpdateInput,
  ): Promise<log_smartnewsystem_mantenedores_os>;
}
