import { log_sofman_tarefas_opcao, Prisma } from '@prisma/client';

export default abstract class LogTaskOptionRepository {
  abstract listByClient(
    clientId: number,
    filter?: Prisma.log_sofman_tarefas_opcaoWhereInput | null,
  ): Promise<log_sofman_tarefas_opcao[]>;
}
