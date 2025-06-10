import { Injectable } from '@nestjs/common';
import { log_sofman_tarefas_ordem_servico, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import LogTaskServiceOrderRepository from '../log-task-service-order-repository';
import ILogTaskServiceOrder from 'src/models/ILogTaskServiceOrder';

@Injectable()
export default class LogTaskServiceOrderRepositoryPrisma
  implements LogTaskServiceOrderRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.log_sofman_tarefas_ordem_servico;

  async listByBranch(
    branches: number[],
    filter?: Prisma.log_sofman_tarefas_ordem_servicoWhereInput | null,
  ): Promise<ILogTaskServiceOrder['listByBranch'][]> {
    const logTask = await this.table.findMany({
      select: {
        id: true,
        id_app: true,
        acao: true,
        id_ordem_servico: true,
        id_tarefa_servico: true,
        status_tarefa: true,
        tarefa: true,
        taskServiceOrder: {
          select: {
            id: true,
            id_unidade_medida: true,
            periodicidade_uso: true,
            observacao: true,
            registerHour: {
              select: {
                id: true,
                inicio: true,
                fim: true,
              },
            },
          },
        },
      },
      where: {
        serviceOrder: {
          ID_filial: {
            in: branches,
          },
        },
        ...filter,
      },
    });

    return logTask;
  }

  async last(
    where?: Prisma.log_sofman_tarefas_ordem_servicoWhereInput | null,
  ): Promise<log_sofman_tarefas_ordem_servico> {
    const logTask = await this.table.findFirst({
      where,
      orderBy: {
        id: 'desc',
      },
    });

    return logTask;
  }

  async update(
    id: number,
    data: Prisma.log_sofman_tarefas_ordem_servicoUncheckedUpdateInput,
  ): Promise<log_sofman_tarefas_ordem_servico> {
    const logTask = await this.table.update({
      where: {
        id,
      },
      data,
    });

    return logTask;
  }
}
