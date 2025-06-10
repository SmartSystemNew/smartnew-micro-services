import { Injectable } from '@nestjs/common';
import { Prisma, sofman_cad_tarefas } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { ITask } from 'src/models/ITask';
import { querySetFilter } from 'src/service/queryFilters.service';
import { querySetSelect } from 'src/service/querySelect.service';
import TaskRepository from '../task-repository';

@Injectable()
export default class TaskRepositoryPrisma implements TaskRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_cad_tarefas;

  async findById(id: number): Promise<ITask['findById'] | null> {
    const task = await this.table.findFirst({
      select: {
        id: true,
        tarefa: true,
        retorno: true,
        tipo_dado: true,
        taskList: {
          select: {
            id: true,
            option: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });

    return task;
  }

  async findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<sofman_cad_tarefas | null> {
    const task = await this.table.findFirst({
      where: {
        id_cliente: clientId,
        tarefa: name,
      },
    });

    return task;
  }

  async insert(
    data: Prisma.sofman_cad_tarefasUncheckedCreateInput,
  ): Promise<sofman_cad_tarefas> {
    const task = await this.table.create({
      data,
    });

    return task;
  }

  async update(
    id: number,
    data: Prisma.sofman_cad_tarefasUncheckedUpdateInput,
  ): Promise<sofman_cad_tarefas> {
    const task = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return task;
  }

  async listByClient(
    idClient: number,
    filters: Prisma.sofman_cad_tarefasWhereInput = {},
    fields: string[] = [],
  ): Promise<ITask['listByClient'][]> {
    const where: Prisma.sofman_cad_tarefasWhereInput = {
      id_cliente: idClient,
    };

    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_cad_tarefasSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            id: true,
            id_cliente: true,
            id_filial: true,
            tarefa: true,
            id_criticidade: true,
            mascara: true,
            retorno: true,
            id_legenda_padrao: true,
            id_unidade_vinculada: true,
            obrigatorio: true,
            log_user: true,
            log_date: true,
            tipo_dado: true,
          };

    filters = Object.keys(filters).length > 0 && querySetFilter(filters);

    const obj = await this.table.findMany({
      select: select,
      where: { ...where, ...filters },
    });
    return obj;
  }
}
