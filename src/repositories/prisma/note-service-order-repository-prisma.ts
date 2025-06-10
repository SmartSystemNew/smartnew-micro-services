import { Injectable } from '@nestjs/common';
import { Prisma, sofman_apontamento_os } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { INoteServiceOrder } from 'src/models/INoteServiceOrder';
import { querySetFilter } from 'src/service/queryFilters.service';
import { querySetSelect } from 'src/service/querySelect.service';
import { NoteServiceOrderRepository } from '../note-service-order-repository';

@Injectable()
export default class NoteServiceOrderRepositoryPrisma
  implements NoteServiceOrderRepository
{
  private table = this.prismaService.sofman_apontamento_os;

  constructor(private prismaService: PrismaService) {}
  async findById(id: number): Promise<INoteServiceOrder['findById'] | null> {
    const obj = await this.table.findFirst({
      select: {
        id: true,
        descricao: true,
        observacoes: true,
        tarefas: true,
        data: true,
        data_hora_inicio: true,
        data_hora_inicio_timestamp: true,
        data_hora_termino: true,
        data_hora_termino_timestamp: true,
        tempo_real: true,
        valor_hora: true,
        tipo_manutencao: true,
        finalizado: true,
        id_projeto: true,
        log_date: true,
        log_user: true,
        id_status_os: true,
        aux: true,
        id_equipamento: true,
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
          },
        },
        id_cliente: true,
        company: {
          select: {
            ID: true,
            razao_social: true,
          },
        },
        id_filial: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        id_ordem: true,
        serviceOrder: {
          select: {
            ID: true,
            ordem: true,
          },
        },
        statusServiceOrder: {
          select: {
            id: true,
            status: true,
          },
        },
        id_colaborador: true,
        employee: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      where: {
        id: id,
      },
    });

    return obj;
  }

  async findByTaskServiceOrder(
    taskServiceId: number,
  ): Promise<sofman_apontamento_os | null> {
    const obj = await this.table.findFirst({
      where: {
        id_tarefa_ordem_servico: taskServiceId,
      },
    });

    return obj;
  }

  async create(
    data: Prisma.sofman_apontamento_osUncheckedCreateInput,
  ): Promise<sofman_apontamento_os> {
    const obj = await this.table.create({
      data,
    });

    return obj;
  }

  async update(
    id: number,
    data: Prisma.sofman_apontamento_osUncheckedUpdateInput,
  ): Promise<sofman_apontamento_os> {
    const obj = await this.table.update({
      data,
      where: {
        id: id,
      },
    });

    return obj;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id: id,
      },
    });

    return true;
  }
  async listByBranches(
    branches: number[],
    filters: Prisma.sofman_apontamento_osWhereInput = {},
    fields: string[] = [],
  ): Promise<INoteServiceOrder['listByBranches'][]> {
    const where: Prisma.sofman_apontamento_osWhereInput = {
      id_filial: {
        in: branches,
      },
    };

    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_apontamento_osSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            id: true,
            descricao: true,
            observacoes: true,
            tarefas: true,
            data: true,
            data_hora_inicio: true,
            data_hora_termino: true,
            tempo_real: true,
            valor_hora: true,
            tipo_manutencao: true,
            finalizado: true,
            id_projeto: true,
            log_date: true,
            log_user: true,
            id_status_os: true,
            aux: true,
            id_equipamento: true,
            equipment: {
              select: {
                ID: true,
                equipamento_codigo: true,
              },
            },
            id_cliente: true,
            company: {
              select: {
                ID: true,
                razao_social: true,
              },
            },
            id_filial: true,
            branch: {
              select: {
                ID: true,
                filial_numero: true,
              },
            },
            id_ordem: true,
            serviceOrder: {
              select: {
                ID: true,
                ordem: true,
              },
            },
            statusServiceOrder: {
              select: {
                id: true,
                status: true,
              },
            },
            id_colaborador: true,
            employee: {
              select: {
                id: true,
                nome: true,
              },
            },
          };

    filters = Object.keys(filters).length > 0 && querySetFilter(filters);

    const obj = await this.table.findMany({
      select: select,
      where: { ...where, ...filters },
    });
    return obj;
  }
  async listByClient(
    idClient: number,
    filters: Prisma.sofman_apontamento_osWhereInput = {},
    fields: string[] = [],
  ): Promise<INoteServiceOrder['listByClient'][]> {
    const where: Prisma.sofman_apontamento_osWhereInput = {
      id_cliente: idClient,
    };

    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_apontamento_osSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            id: true,
            descricao: true,
            observacoes: true,
            tarefas: true,
            data: true,
            data_hora_inicio: true,
            data_hora_inicio_timestamp: true,
            data_hora_termino: true,
            data_hora_termino_timestamp: true,
            tempo_real: true,
            valor_hora: true,
            tipo_manutencao: true,
            finalizado: true,
            id_projeto: true,
            log_date: true,
            log_user: true,
            aux: true,
            id_equipamento: true,
            equipment: {
              select: {
                ID: true,
                equipamento_codigo: true,
              },
            },
            id_cliente: true,
            company: {
              select: {
                ID: true,
                razao_social: true,
              },
            },
            id_filial: true,
            branch: {
              select: {
                ID: true,
                filial_numero: true,
              },
            },
            id_ordem: true,
            serviceOrder: {
              select: {
                ID: true,
                ordem: true,
              },
            },
            id_status_os: true,
            statusServiceOrder: {
              select: {
                id: true,
                status: true,
              },
            },
            id_colaborador: true,
            employee: {
              select: {
                id: true,
                nome: true,
              },
            },
          };

    filters = Object.keys(filters).length > 0 && querySetFilter(filters);

    const obj = await this.table.findMany({
      select: select,
      where: { ...where, ...filters },
    });
    return obj;
  }
}
