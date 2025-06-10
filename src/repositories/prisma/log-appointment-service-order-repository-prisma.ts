import { Injectable } from '@nestjs/common';
import { Prisma, log_sofman_apontamento_os } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import LogAppointmentServiceOrderRepository from '../log-appointment-service-order-repository';

@Injectable()
export default class LogAppointmentServiceOrderRepositoryPrisma
  implements LogAppointmentServiceOrderRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.log_sofman_apontamento_os;

  async listByBranch(
    branches: number[],
    filter?: Prisma.log_sofman_apontamento_osWhereInput | null,
  ): Promise<log_sofman_apontamento_os[]> {
    const log = await this.table.findMany({
      where: {
        id_filial: {
          in: branches,
        },
        ...filter,
      },
    });

    return log;
  }
}
