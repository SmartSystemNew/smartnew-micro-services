import { sofman_tarefas_ordem_servico, Prisma } from '@prisma/client';
import ITaskServiceOrder from 'src/models/ITaskServiceOrder';

export default abstract class TaskServiceOrderRepository {
  abstract listByClient(
    clientId: number,
    filter?: Prisma.sofman_tarefas_ordem_servicoWhereInput | null,
  ): Promise<ITaskServiceOrder['listByClient'][]>;
  abstract listByOrder(
    orderId: number,
  ): Promise<ITaskServiceOrder['listByOrder'][]>;

  abstract findByWhere(
    where: Prisma.sofman_tarefas_ordem_servicoWhereInput,
  ): Promise<ITaskServiceOrder['findByWhere'] | null>;
  abstract findById(id: number): Promise<ITaskServiceOrder['findById'] | null>;

  abstract create(
    data: Prisma.sofman_tarefas_ordem_servicoUncheckedCreateInput,
  ): Promise<sofman_tarefas_ordem_servico>;

  abstract update(
    id: number,
    data: Prisma.sofman_tarefas_ordem_servicoUncheckedUpdateInput,
  ): Promise<sofman_tarefas_ordem_servico>;

  abstract delete(id: number): Promise<boolean>;
}
