import { Prisma, log_sofman_apontamento_os } from '@prisma/client';

export default abstract class LogAppointmentServiceOrderRepository {
  abstract listByBranch(
    branches: number[],
    filter?: Prisma.log_sofman_apontamento_osWhereInput | null,
  ): Promise<log_sofman_apontamento_os[]>;
}
