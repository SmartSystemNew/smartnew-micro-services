import { Prisma, sofman_solicitacoes_servico } from '@prisma/client';
import { IRequestService } from 'src/models/IRequestService';

export default abstract class RequestServiceRepository {
  abstract findById(id: number): Promise<IRequestService['findById'] | null>;

  abstract findByIdApp(
    id: string,
  ): Promise<IRequestService['findByIdApp'] | null>;
  abstract countByClientAndBranch(
    clientId: number,
    branchId: number,
  ): Promise<number>;
  abstract listByClient(
    clientId: number,
    minDate: Date,
  ): Promise<IRequestService['listByClient'][]>;

  abstract listByBranches(
    branches: number[],
    filter?: Prisma.sofman_solicitacoes_servicoWhereInput | null,
  ): Promise<IRequestService['listByBranches'][]>;

  abstract create(
    data: Prisma.sofman_solicitacoes_servicoUncheckedCreateInput,
  ): Promise<sofman_solicitacoes_servico>;

  abstract update(
    id: number,
    data: Prisma.sofman_solicitacoes_servicoUncheckedUpdateInput,
  ): Promise<sofman_solicitacoes_servico>;

  abstract delete(id: number): Promise<boolean>;
}
