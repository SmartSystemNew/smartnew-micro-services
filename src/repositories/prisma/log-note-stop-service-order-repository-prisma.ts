import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { LogNoteStopServiceOrderRepository } from '../log-note-stop-service-order-repository';
import ILogNoteStopServiceOrder from 'src/models/ILogNoteStopServiceOrder';
import { Prisma } from '@prisma/client';

@Injectable()
export default class LogNoteStopServiceOrderRepositoryPrisma
  implements LogNoteStopServiceOrderRepository
{
  private table = this.prismaService.log_sofman_apontamento_paradas;

  constructor(private prismaService: PrismaService) {}

  async findByMany(
    branches: number[],
    filter?: Prisma.log_sofman_apontamento_paradasWhereInput,
  ): Promise<ILogNoteStopServiceOrder['findById'][] | null> {
    const obj = await this.table.findMany({
      select: {
        id: true,
        id_app: true,
        id_apontamento_parada: true,
        acao: true,
        data_hora_stop: true,
        data_hora_start: true,
        observacoes: true,
        log_date: true,
        id_ordem_servico: true,
        serviceOrder: {
          select: {
            ID: true,
            ordem: true,
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

    return obj;
  }

  async listByServiceOrder(
    idServiceOrder: number,
  ): Promise<ILogNoteStopServiceOrder['listByServiceOrder'] | null> {
    const obj = await this.table.findFirst({
      select: {
        id: true,
        data_hora_stop: true,
        data_hora_start: true,
        observacoes: true,
        log_date: true,
      },
      where: {
        id_ordem_servico: idServiceOrder,
      },
    });

    return obj;
  }
}
