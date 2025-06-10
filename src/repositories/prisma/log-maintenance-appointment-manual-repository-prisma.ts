import { Injectable } from '@nestjs/common';
import {
  log_smartnewsystem_manutencao_apontamento_manual,
  Prisma,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import LogMaintenanceAppointmentManualRepository from '../log-maintenance-appointment-manual-repository';

@Injectable()
export default class LogMaintenanceAppointmentManualRepositoryPrisma
  implements LogMaintenanceAppointmentManualRepository
{
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService.log_smartnewsystem_manutencao_apontamento_manual;

  async listByBranch(
    branches: number[],
    filter?: Prisma.log_smartnewsystem_manutencao_apontamento_manualWhereInput,
  ): Promise<log_smartnewsystem_manutencao_apontamento_manual[]> {
    const log = await this.table.findMany({
      where: {
        serviceOrder: {
          branch: {
            ID: {
              in: branches,
            },
          },
        },
        ...filter,
      },
    });

    return log;
  }
}
