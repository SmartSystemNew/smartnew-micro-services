import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import ILogRequestService from 'src/models/ILogRequestService';
import LogRequestServiceRepository from '../log-request-service-repository';

@Injectable()
export default class LogRequestServiceRepositoryPrisma
  implements LogRequestServiceRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.log_sofman_solicitacoes_servico;

  async listByBranchesAndFilter(
    branches: number[],
    filter?: Prisma.log_sofman_solicitacoes_servicoWhereInput | null,
  ): Promise<ILogRequestService['listByBranchesAndFilter'][]> {
    const logs = await this.table.findMany({
      select: {
        id: true,
        acao: true,
        id_solicitacao: true,
        codigo_solicitacao: true,
        id_app: true,
        id_equipamento: true,
        id_problema: true,
        prioridade: true,
        maquina_parada: true,
        data_equipamento_parou: true,
        assunto: true,
        mensagem: true,
        status: true,
        log_date: true,
        data_prevista: true,
        requestService: {
          select: {
            id: true,
            id_app: true,
            orderService: {
              select: {
                ID: true,
                ordem: true,
                log_date: true,
                id_app: true,
              },
            },
          },
        },
      },
      where: {
        id_filial: { in: branches },
        ...filter,
      },
    });

    return logs;
  }
}
