import { Injectable } from '@nestjs/common';
import { log_sofman_tarefas_opcao } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import LogTaskOptionRepository from '../log-task-option-repository';

@Injectable()
export default class LogTaskOptionRepositoryPrisma
  implements LogTaskOptionRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.log_sofman_tarefas_opcao;

  async listByClient(
    clientId: number,
    filter?: Prisma.log_sofman_tarefas_opcaoWhereInput | null,
  ): Promise<log_sofman_tarefas_opcao[]> {
    const logTaskOptions = await this.table.findMany({
      where: {
        id_cliente: clientId,
        ...filter,
      },
    });

    return logTaskOptions;
  }
}
