import { Injectable } from '@nestjs/common';
import { log_sofman_unidade_medida_planos_prev, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import LogUnityOfMensurePlansRepository from '../log-unity-of-mensure-plans-repository';

@Injectable()
export default class LogUnityOfMensurePlansRepositoryPrisma
  implements LogUnityOfMensurePlansRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.log_sofman_unidade_medida_planos_prev;

  async listByClient(
    clientId: number,
    filter?: Prisma.log_sofman_unidade_medida_planos_prevWhereInput | null,
  ): Promise<log_sofman_unidade_medida_planos_prev[]> {
    const logs = await this.table.findMany({
      where: {
        id_cliente: clientId,
        ...filter,
      },
    });

    return logs;
  }
}
