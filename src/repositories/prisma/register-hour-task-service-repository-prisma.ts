import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_registro_hora_tarefa } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import RegisterHourTaskServiceRepository from '../register-hour-task-service-repository';

@Injectable()
export default class RegisterHourTaskServiceRepositoryPrisma
  implements RegisterHourTaskServiceRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_registro_hora_tarefa;

  async findById(
    id: number,
  ): Promise<smartnewsystem_registro_hora_tarefa | null> {
    const log = await this.table.findUnique({
      where: { id },
    });

    return log;
  }

  async findByWhere(
    where: Prisma.smartnewsystem_registro_hora_tarefaWhereInput,
  ): Promise<smartnewsystem_registro_hora_tarefa | null> {
    const log = await this.table.findFirst({
      where,
    });

    return log;
  }

  async create(
    data: Prisma.smartnewsystem_registro_hora_tarefaUncheckedCreateInput,
  ): Promise<smartnewsystem_registro_hora_tarefa> {
    const log = await this.table.create({ data });

    return log;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_registro_hora_tarefaUncheckedUpdateInput,
  ): Promise<smartnewsystem_registro_hora_tarefa> {
    const log = await this.table.update({
      where: { id },
      data,
    });

    return log;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }

  async deleteByTask(taskId: number): Promise<boolean> {
    await this.table.deleteMany({ where: { id_tarefa_servico: taskId } });

    return true;
  }
}
