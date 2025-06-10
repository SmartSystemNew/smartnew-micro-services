import { Prisma } from '@prisma/client';
import ILogTaskListOption from 'src/models/ILogTaskListOption';

export default abstract class LogTaskListOptionRepository {
  abstract listByClient(
    clientId: number,
    filter?: Prisma.log_sofman_tarefas_lista_opcaoWhereInput | null,
  ): Promise<ILogTaskListOption['listByClient'][]>;
}
