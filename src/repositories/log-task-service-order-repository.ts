import { log_sofman_tarefas_ordem_servico, Prisma } from '@prisma/client';
import ILogTaskServiceOrder from 'src/models/ILogTaskServiceOrder';

export default abstract class LogTaskServiceOrderRepository {
  abstract listByBranch(
    branches: number[],
    filter?: Prisma.log_sofman_tarefas_ordem_servicoWhereInput | null,
  ): Promise<ILogTaskServiceOrder['listByBranch'][]>;

  abstract last(
    where?: Prisma.log_sofman_tarefas_ordem_servicoWhereInput | null,
  ): Promise<log_sofman_tarefas_ordem_servico>;

  abstract update(
    id: number,
    data: Prisma.log_sofman_tarefas_ordem_servicoUncheckedUpdateInput,
  ): Promise<log_sofman_tarefas_ordem_servico>;
}
