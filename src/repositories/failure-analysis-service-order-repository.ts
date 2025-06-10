import { Prisma, sofman_analise_falha } from '@prisma/client';
import { IFailureAnalysisServiceOrder } from 'src/models/IFailureAnalysisServiceOrder';

export abstract class FailureAnalysisServiceOrderRepository {
  abstract findById(
    id: number,
  ): Promise<IFailureAnalysisServiceOrder['findById'] | null>;

  abstract create(
    data: Prisma.sofman_analise_falhaUncheckedCreateInput,
  ): Promise<sofman_analise_falha>;

  abstract delete(id: number): Promise<boolean>;

  abstract update(
    id: number,
    data: Prisma.sofman_analise_falhaUncheckedUpdateInput,
  ): Promise<sofman_analise_falha>;

  abstract listByServiceOrder(
    idServiceOrder: number,
    filters?: Prisma.sofman_analise_falhaWhereInput | any,
    fields?: string[],
  ): Promise<IFailureAnalysisServiceOrder['listByServiceOrder'][]>;
}
