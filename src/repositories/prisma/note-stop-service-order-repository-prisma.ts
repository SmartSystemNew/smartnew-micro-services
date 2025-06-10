import { Injectable } from '@nestjs/common';
import { Prisma, sofman_apontamento_paradas } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { INoteStopServiceOrder } from 'src/models/INoteStopServiceOrder';
import { querySetFilter } from 'src/service/queryFilters.service';
import { querySetSelect } from 'src/service/querySelect.service';
import { NoteStopServiceOrderRepository } from '../note-stop-service-order-repository';

@Injectable()
export default class NoteStopServiceOrderRepositoryPrisma
  implements NoteStopServiceOrderRepository
{
  private table = this.prismaService.sofman_apontamento_paradas;

  constructor(private prismaService: PrismaService) {}
  async findById(
    id: number,
  ): Promise<INoteStopServiceOrder['findById'] | null> {
    const obj = await this.table.findFirst({
      select: {
        id: true,
        id_app: true,
        data_hora_stop: true,
        data_hora_start: true,
        observacoes: true,
        entrada: true,
        log_user: true,
        log_date: true,
        id_equipamento: true,
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
          },
        },
        id_ordem_servico: true,
        serviceOrder: {
          select: {
            ID: true,
            ordem: true,
          },
        },
        id_causa: true,
        failureCause: {
          select: {
            id: true,
            descricao: true,
          },
        },
        id_setor_executante: true,
        sectorExecutor: {
          select: {
            Id: true,
            descricao: true,
          },
        },
        id_lote: true,
        noteStopBatch: {
          select: {
            id: true,
            observacoes: true,
          },
        },
      },
      where: {
        id: id,
      },
    });

    return obj;
  }

  async create(
    data: Prisma.sofman_apontamento_paradasUncheckedCreateInput,
  ): Promise<sofman_apontamento_paradas> {
    const obj = await this.table.create({
      data,
    });

    return obj;
  }

  async update(
    id: number,
    data: Prisma.sofman_apontamento_paradasUncheckedUpdateInput,
  ): Promise<sofman_apontamento_paradas> {
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
  async listByServiceOrder(
    idServiceOrder: number,
    filters: Prisma.sofman_apontamento_paradasWhereInput = {},
    fields: string[] = [],
  ): Promise<INoteStopServiceOrder['listByServiceOrder'][]> {
    const where: Prisma.sofman_apontamento_paradasWhereInput = {
      id_ordem_servico: idServiceOrder,
    };

    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_apontamento_paradasSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            id: true,
            id_app: true,
            data_hora_stop: true,
            data_hora_start: true,
            observacoes: true,
            entrada: true,
            log_user: true,
            log_date: true,
            id_equipamento: true,
            equipment: {
              select: {
                ID: true,
                equipamento_codigo: true,
              },
            },
            id_ordem_servico: true,
            serviceOrder: {
              select: {
                ID: true,
                ordem: true,
              },
            },
            id_causa: true,
            failureCause: {
              select: {
                id: true,
                descricao: true,
              },
            },
            id_setor_executante: true,
            sectorExecutor: {
              select: {
                Id: true,
                descricao: true,
              },
            },
            id_lote: true,
            noteStopBatch: {
              select: {
                id: true,
                observacoes: true,
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
