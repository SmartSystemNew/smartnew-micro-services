import { Prisma, sofman_anexos_os } from '@prisma/client';
import { IAttachmentsServiceOrder } from 'src/models/IAttachmentsServiceOrder';

export abstract class AttachmentsServiceOrderRepository {
  abstract findById(
    id: number,
  ): Promise<IAttachmentsServiceOrder['findById'] | null>;

  abstract create(
    data: Prisma.sofman_anexos_osUncheckedCreateInput,
  ): Promise<sofman_anexos_os>;

  abstract delete(id: number): Promise<boolean>;

  abstract update(
    id: number,
    data: Prisma.sofman_anexos_osUncheckedUpdateInput,
  ): Promise<sofman_anexos_os>;

  abstract listByServiceOrder(
    idServiceOrder: number,
    filters?: Prisma.sofman_anexos_osWhereInput | any,
    fields?: string[],
  ): Promise<IAttachmentsServiceOrder['listByServiceOrder'][]>;
}
