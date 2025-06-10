import { Injectable } from '@nestjs/common';
import { Prisma, sofman_tarefas_ordem_servico } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import TaskServiceOrderRepository from '../task-service-order-repository';
import ITaskServiceOrder from 'src/models/ITaskServiceOrder';

@Injectable()
export default class TaskServiceOrderRepositoryPrisma
  implements TaskServiceOrderRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_tarefas_ordem_servico;

  async listByClient(
    clientId: number,
    filter?: Prisma.sofman_tarefas_ordem_servicoWhereInput | null,
  ): Promise<ITaskServiceOrder['listByClient'][]> {
    const task = await this.table.findMany({
      select: {
        id: true,
        status_exec: true,
        periodicidade_uso: true,
        minutos: true,
        task: {
          select: {
            id: true,
            tarefa: true,
          },
        },
        taskPlanningMaintenance: {
          select: {
            id: true,
            descriptionPlanMaintenance: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        legendTask: {
          select: {
            id: true,
            legenda: true,
            descricao: true,
          },
        },
        unity: {
          select: {
            id: true,
            unidade: true,
          },
        },
      },
      where: {
        id_cliente: clientId,
        ...filter,
      },
    });

    return task;
  }

  async listByOrder(
    orderId: number,
  ): Promise<ITaskServiceOrder['listByOrder'][]> {
    const task = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        status_exec: true,
        periodicidade_uso: true,
        minutos: true,
        observacao: true,
        component: {
          select: {
            id: true,
            componente: true,
          },
        },
        planTask: {
          select: {
            ID: true,
            planDescription: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        task: {
          select: {
            id: true,
            tarefa: true,
            tipo_dado: true,
          },
        },
        taskPlanningMaintenance: {
          select: {
            id: true,
            descriptionPlanMaintenance: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        registerHour: {
          select: {
            id: true,
            inicio: true,
            fim: true,
          },
        },
        legendTask: {
          select: {
            id: true,
            legenda: true,
            descricao: true,
          },
        },
        unity: {
          select: {
            id: true,
            unidade: true,
          },
        },
        taskReturn: {
          select: {
            id: true,
            retorno_numero: true,
            retorno_opcao: true,
            retorno_texto: true,
          },
        },
      },
      where: { id_ordem_servico: orderId },
    });

    return task;
  }

  async findById(id: number): Promise<ITaskServiceOrder['findById'] | null> {
    const task = await this.table.findFirst({
      select: {
        id: true,
        status_exec: true,
        periodicidade_uso: true,
        minutos: true,
        serviceOrder: {
          select: {
            ID: true,
            ordem: true,
          },
        },
        task: {
          select: {
            id: true,
            tarefa: true,
            tipo_dado: true,
            obrigatorio: true,
          },
        },
        taskPlanningMaintenance: {
          select: {
            id: true,
            descriptionPlanMaintenance: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        unity: {
          select: {
            id: true,
            unidade: true,
          },
        },
        registerHour: {
          select: {
            id: true,
            inicio: true,
            fim: true,
          },
        },
      },
      where: { id },
    });

    return task;
  }

  async findByWhere(
    where: Prisma.sofman_tarefas_ordem_servicoWhereInput,
  ): Promise<ITaskServiceOrder['findByWhere'] | null> {
    const task = await this.table.findFirst({
      select: {
        id: true,
        status_exec: true,
        periodicidade_uso: true,
        minutos: true,
        serviceOrder: {
          select: {
            ID: true,
            ordem: true,
          },
        },
        planTask: {
          select: {
            ID: true,
            planDescription: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        task: {
          select: {
            id: true,
            tarefa: true,
            tipo_dado: true,
          },
        },
        taskPlanningMaintenance: {
          select: {
            id: true,
            descriptionPlanMaintenance: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        unity: {
          select: {
            id: true,
            unidade: true,
          },
        },
        registerHour: {
          select: {
            id: true,
            inicio: true,
            fim: true,
          },
        },
      },
      where,
    });

    return task;
  }

  async create(
    data: Prisma.sofman_tarefas_ordem_servicoUncheckedCreateInput,
  ): Promise<sofman_tarefas_ordem_servico> {
    const task = await this.table.create({
      data,
    });

    return task;
  }

  async update(
    id: number,
    data: Prisma.sofman_tarefas_ordem_servicoUncheckedUpdateInput,
  ): Promise<sofman_tarefas_ordem_servico> {
    const task = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return task;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
