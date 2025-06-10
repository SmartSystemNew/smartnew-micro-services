import { Injectable } from '@nestjs/common';
import { log_smartnewsystem_mantenedores_os, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import LogServiceOrderMaintainerRepository from '../log-service-order-maintainer-repository';

@Injectable()
export default class LogServiceOrderMaintainerRepositoryPrisma
  implements LogServiceOrderMaintainerRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.log_smartnewsystem_mantenedores_os;

  async listByMaintainerAndOrders(
    branches: number[],
    filter?: Prisma.log_smartnewsystem_mantenedores_osWhereInput | null,
  ): Promise<log_smartnewsystem_mantenedores_os[]> {
    const logs = await this.table.findMany({
      select: {
        id: true,
        id_app: true,
        acao: true,
        id_mantenedores_os: true,
        id_ordem_servico: true,
        id_colaborador: true,
        log_date: true,
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
    return logs;
  }

  async last(
    where?: Prisma.log_smartnewsystem_mantenedores_osWhereInput | null,
  ): Promise<log_smartnewsystem_mantenedores_os> {
    const log = await this.table.findFirst({
      orderBy: {
        id: 'desc',
      },
      where,
    });

    return log;
  }

  async update(
    id: number,
    data: Prisma.log_smartnewsystem_mantenedores_osUpdateInput,
  ): Promise<log_smartnewsystem_mantenedores_os> {
    const log = await this.table.update({
      where: {
        id,
      },
      data,
    });

    return log;
  }
}
