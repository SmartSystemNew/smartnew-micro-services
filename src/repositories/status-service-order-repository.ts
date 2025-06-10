import { Prisma, sofman_status_ordem_servico } from '@prisma/client';
import { IServiceOrderStatus } from 'src/models/IServiceOrderStatus';

export abstract class StatusServiceOrderRepository {
  abstract findByClientAndStatus(
    clientId: number,
    status: string,
  ): Promise<IServiceOrderStatus['findByClientAndStatus'] | null>;
  abstract findById(
    id: number,
  ): Promise<IServiceOrderStatus['findById'] | null>;

  abstract create(
    data: Prisma.sofman_status_ordem_servicoUncheckedCreateInput,
  ): Promise<sofman_status_ordem_servico>;

  abstract delete(id: number): Promise<boolean>;

  abstract listByClient(
    idClient: number,
    filters?: Prisma.sofman_status_ordem_servicoWhereInput | any,
    fields?: string[],
  ): Promise<IServiceOrderStatus['listByClient'][]>;
  abstract choiceServiceOrderStatus(
    idClient: number,
    typeAccess: number,
  ): Promise<IServiceOrderStatus['choiceServiceOrderStatus'][]>;

  abstract update(
    id: number,
    data: Prisma.sofman_status_ordem_servicoUncheckedUpdateInput,
  ): Promise<sofman_status_ordem_servico>;
}
