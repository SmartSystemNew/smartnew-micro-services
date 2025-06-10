import { Injectable } from '@nestjs/common';
import {
  log_sofman_cad_status_solicitacoes_servico,
  Prisma,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import LogStatusRequestServiceRepository from '../log-status-request-service-repository';

@Injectable()
export default class LogStatusRequestServiceRepositoryPrisma
  implements LogStatusRequestServiceRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.log_sofman_cad_status_solicitacoes_servico;

  async listByClient(
    clientId: number,
    filter?: Prisma.log_sofman_cad_status_solicitacoes_servicoWhereInput | null,
  ): Promise<log_sofman_cad_status_solicitacoes_servico[]> {
    const logs = await this.table.findMany({
      where: {
        id_cliente: clientId,
        ...filter,
      },
    });

    return logs;
  }
}
