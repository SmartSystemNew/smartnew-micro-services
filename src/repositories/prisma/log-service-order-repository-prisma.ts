import { Injectable } from '@nestjs/common';
import { log_controle_de_ordens_de_servico, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import ILogServiceOrder from 'src/models/ILogServiceOrder';
import LogServiceOrderRepository from '../log-service-order-repository';

@Injectable()
export default class LogServiceOrderRepositoryPrisma
  implements LogServiceOrderRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.log_controle_de_ordens_de_servico;

  async listByBranchesAndFilter(
    branches: number[],
    filter?: Prisma.log_controle_de_ordens_de_servicoWhereInput | null,
  ): Promise<log_controle_de_ordens_de_servico[]> {
    const logs = await this.table.findMany({
      where: {
        ID_filial: { in: branches },
        ...filter,
      },
    });

    return logs;
  }

  async listOnlyServiceOrderIdByBranchesAndFilter(
    branches: number[],
    filter?: Prisma.log_controle_de_ordens_de_servicoWhereInput | null,
  ): Promise<ILogServiceOrder['listOnlyServiceOrderIdByBranchesAndFilter'][]> {
    const logs = await this.table.findMany({
      select: {
        id: true,
        id_ordem: true,
        acao: true,
        id_solicitante: true,
        id_app: true,
      },
      where: {
        ID_filial: { in: branches },
        ...filter,
      },
    });

    return logs;
  }
}
