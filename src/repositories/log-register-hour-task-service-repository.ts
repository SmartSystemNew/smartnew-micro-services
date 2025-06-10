import { Prisma } from '@prisma/client';
import ILogRegisterTaskServiceOrder from 'src/models/ILogRegisterTaskServiceOrder';

export default abstract class LogRegisterHourTaskServiceRepository {
  abstract listByBranches(
    branches: number[],
    filter?: Prisma.log_smartnewsystem_registro_hora_tarefaWhereInput | null,
  ): Promise<ILogRegisterTaskServiceOrder['listRegisterTaskServiceOrder']>;
}
