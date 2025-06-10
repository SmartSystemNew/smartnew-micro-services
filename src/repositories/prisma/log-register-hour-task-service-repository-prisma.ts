import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import LogRegisterHourTaskServiceRepository from '../log-register-hour-task-service-repository';
import ILogRegisterTaskServiceOrder from 'src/models/ILogRegisterTaskServiceOrder';

@Injectable()
export default class LogRegisterHourTaskServiceRepositoryPrisma
  implements LogRegisterHourTaskServiceRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.log_smartnewsystem_registro_hora_tarefa;

  async listByBranches(
    branches: number[],
    filter?: Prisma.log_smartnewsystem_registro_hora_tarefaWhereInput | null,
  ): Promise<ILogRegisterTaskServiceOrder['listRegisterTaskServiceOrder']> {
    const log = await this.table.findMany({
      select: {
        id: true,
        id_app: true,
        id_tarefa_servico: true,
        id_registro: true,
        inicio: true,
        fim: true,
        acao: true,
        log_date: true,
        registerHour: {
          select: {
            taskServiceOrder: {
              select: {
                serviceOrder: {
                  select: {
                    ID: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        registerHour: {
          taskServiceOrder: {
            serviceOrder: {
              ID_filial: {
                in: branches,
              },
            },
          },
        },
        ...filter,
      },
    });

    return log;
  }
}
