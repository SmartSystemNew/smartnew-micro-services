import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_manutencao_tarefas_retorno,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import TaskServiceOrderReturnRepository from '../task-service-order-return-repository';

@Injectable()
export default class TaskServiceOrderReturnRepositoryPrisma
  implements TaskServiceOrderReturnRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_manutencao_tarefas_retorno;

  async findByTaskServiceTask(
    taskServiceOrderId: number,
    taskId: number,
    filter?: Prisma.smartnewsystem_manutencao_tarefas_retornoWhereInput | null,
  ): Promise<smartnewsystem_manutencao_tarefas_retorno[]> {
    const returnTask = await this.table.findMany({
      where: {
        id_tarefa_servico: taskServiceOrderId,
        id_tarefa: taskId,
        ...filter,
      },
    });

    return returnTask;
  }

  async findById(
    id: number,
  ): Promise<smartnewsystem_manutencao_tarefas_retorno | null> {
    const returnTask = await this.table.findFirst({
      where: {
        id,
      },
    });

    return returnTask;
  }

  async create(
    data: Prisma.smartnewsystem_manutencao_tarefas_retornoUncheckedCreateInput,
  ): Promise<smartnewsystem_manutencao_tarefas_retorno> {
    const returnTask = await this.table.create({ data });

    return returnTask;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_manutencao_tarefas_retornoUncheckedUpdateInput,
  ): Promise<smartnewsystem_manutencao_tarefas_retorno> {
    const returnTask = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return returnTask;
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
