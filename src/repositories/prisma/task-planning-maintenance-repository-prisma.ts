import { Injectable } from '@nestjs/common';
import { Prisma, sofman_tarefas_planejamento_manutencao } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import TaskPlanningMaintenanceRepository from '../task-planning-maintenance-repository';

@Injectable()
export default class TaskPlanningMaintenanceRepositoryPrisma
  implements TaskPlanningMaintenanceRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_tarefas_planejamento_manutencao;

  async findById(
    id: number,
  ): Promise<sofman_tarefas_planejamento_manutencao | null> {
    const task = await this.table.findFirst({
      where: {
        id,
      },
    });

    return task;
  }

  async findByPlanningAndTask(
    planningId: number,
    taskId: number,
  ): Promise<sofman_tarefas_planejamento_manutencao | null> {
    const task = await this.table.findFirst({
      where: {
        id_planejamento: planningId,
        id_tarefa: taskId,
      },
    });

    return task;
  }

  async insert(
    data: Prisma.sofman_tarefas_planejamento_manutencaoUncheckedCreateInput,
  ): Promise<sofman_tarefas_planejamento_manutencao> {
    const task = await this.table.create({
      data,
    });

    return task;
  }

  async update(
    id: number,
    data: Prisma.sofman_tarefas_planejamento_manutencaoUncheckedUpdateInput,
  ): Promise<sofman_tarefas_planejamento_manutencao> {
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
