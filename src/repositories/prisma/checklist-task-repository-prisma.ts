import { PrismaService } from 'src/database/prisma.service';
import { ICheckListTask, IListByClient } from 'src/models/ICheckListTask';
import { CheckListTaskRepository } from '../checklist-task-repository';
import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_producao_checklist_tarefas,
} from '@prisma/client';

@Injectable()
export class CheckListTaskRepositoryPrisma implements CheckListTaskRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_producao_checklist_tarefas;

  async listByClient(
    clientId: number,
    filter:
      | Prisma.smartnewsystem_producao_checklist_tarefasWhereInput
      | undefined,
  ): Promise<IListByClient[]> {
    return await this.table.findMany({
      select: {
        id: true,
        descricao: true,
      },
      where: {
        id_cliente: clientId,
        ...filter,
      },
    });
  }

  async findById(taskId: number): Promise<ICheckListTask['findById'] | null> {
    const task = await this.table.findUnique({
      select: {
        id: true,
        descricao: true,
        checkListItens: {
          select: {
            checkList: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      where: {
        id: taskId,
      },
    });

    return task;
  }

  async findByClientAndTask(
    clientId: number,
    name: string,
  ): Promise<smartnewsystem_producao_checklist_tarefas | null> {
    const task = await this.table.findFirst({
      where: {
        id_cliente: clientId,
        descricao: name,
      },
    });

    return task;
  }

  async create(
    data: Prisma.smartnewsystem_producao_checklist_tarefasUncheckedCreateInput,
  ): Promise<smartnewsystem_producao_checklist_tarefas> {
    return await this.table.create({
      data,
    });
  }

  async update(
    data: Prisma.smartnewsystem_producao_checklist_tarefasUncheckedUpdateInput,
    id: number,
  ): Promise<smartnewsystem_producao_checklist_tarefas> {
    return await this.table.update({
      data,
      where: {
        id,
      },
    });
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
