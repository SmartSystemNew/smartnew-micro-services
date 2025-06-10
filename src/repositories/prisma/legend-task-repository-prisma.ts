import { Injectable } from '@nestjs/common';
import { Prisma, sofman_legenda_tarefas } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import LegendTaskRepository from '../legend-task-repository';

@Injectable()
export default class LegendTaskRepositoryPrisma
  implements LegendTaskRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_legenda_tarefas;

  async listByClient(
    clientId: number,
    filter?: Prisma.sofman_legenda_tarefasWhereInput | null,
  ): Promise<sofman_legenda_tarefas[]> {
    const legendTasks = await this.table.findMany({
      select: {
        id: true,
        id_cliente: true,
        legenda: true,
        acao: true,
        descricao: true,
        planos_associados: true,
        log_user: true,
        log_date: true,
        tipo_manutencao: true,
      },
      where: {
        id_cliente: clientId,
        ...filter,
      },
    });

    return legendTasks;
  }

  async create(
    data: Prisma.sofman_legenda_tarefasUncheckedCreateInput,
  ): Promise<sofman_legenda_tarefas> {
    const legendTask = await this.table.create({
      data,
    });

    return legendTask;
  }

  async update(
    id: number,
    data: Prisma.sofman_legenda_tarefasUncheckedUpdateInput,
  ): Promise<sofman_legenda_tarefas> {
    const legendTask = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return legendTask;
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
