import { Prisma, sofman_cad_custos_ordens_servico } from '@prisma/client';
import { ICostServiceOrder } from 'src/models/ICostServiceOrder';

export abstract class CostServiceOrderRepository {
  abstract findById(id: number): Promise<ICostServiceOrder['findById'] | null>;

  abstract create(
    data: Prisma.sofman_cad_custos_ordens_servicoUncheckedCreateInput,
  ): Promise<sofman_cad_custos_ordens_servico>;

  abstract delete(id: number): Promise<boolean>;

  abstract update(
    id: number,
    data: Prisma.sofman_cad_custos_ordens_servicoUncheckedUpdateInput,
  ): Promise<sofman_cad_custos_ordens_servico>;

  abstract listByServiceOrder(
    idServiceOrder: number,
    filters?: Prisma.sofman_cad_custos_ordens_servicoWhereInput | any,
    fields?: Array<string>,
  ): Promise<ICostServiceOrder['listByServiceOrder'][]>;
}
