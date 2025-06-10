import { Prisma, log_sofman_anexos_os } from '@prisma/client';

export default abstract class LogAttachmentServiceOrderRepository {
  abstract listByClient(
    clientId: number,
    filter?: Prisma.log_sofman_anexos_osWhereInput | null,
  ): Promise<log_sofman_anexos_os[]>;
  abstract listByOrder(
    orderId: number,
    filter?: Prisma.log_sofman_anexos_osWhereInput | null,
  ): Promise<log_sofman_anexos_os[]>;
}
