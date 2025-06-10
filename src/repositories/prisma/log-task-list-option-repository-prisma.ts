import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import LogTaskListOptionRepository from '../log-task-list-option-repository';
import ILogTaskListOption from 'src/models/ILogTaskListOption';
import { Prisma } from '@prisma/client';

@Injectable()
export default class LogTaskListOptionRepositoryPrisma
  implements LogTaskListOptionRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.log_sofman_tarefas_lista_opcao;

  async listByClient(
    clientId: number,
    filter?: Prisma.log_sofman_tarefas_lista_opcaoWhereInput | null,
  ): Promise<ILogTaskListOption['listByClient'][]> {
    const logTaskOptions = await this.table.findMany({
      select: {
        id: true,
        id_app: true,
        id_tarefa: true,
        acao: true,
        id_tarefa_lista: true,
        id_tarefa_opcao: true,
        task: {
          select: {
            id: true,
            tarefa: true,
          },
        },
      },
      where: {
        task: {
          id_cliente: clientId,
        },
        ...filter,
      },
    });

    return logTaskOptions;
  }
}
