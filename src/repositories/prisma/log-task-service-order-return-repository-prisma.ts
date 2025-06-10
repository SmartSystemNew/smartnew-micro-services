import { Injectable } from '@nestjs/common';
import {
  log_smartnewsystem_manutencao_tarefas_retorno,
  Prisma,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import LogTaskServiceOrderReturnRepository from '../log-task-service-order-return-repository';
import ILogTaskServiceOrderReturn from 'src/models/ILogTaskServiceOrderReturn';

@Injectable()
export default class LogTaskServiceOrderReturnRepositoryPrisma
  implements LogTaskServiceOrderReturnRepository
{
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService.log_smartnewsystem_manutencao_tarefas_retorno;

  async listByClient(
    clientId: number,
    filter?: Prisma.log_smartnewsystem_manutencao_tarefas_retornoWhereInput | null,
  ): Promise<ILogTaskServiceOrderReturn['listByClient'][]> {
    const logs = await this.table.findMany({
      select: {
        id: true,
        acao: true,
        id_tarefa_retorno: true,
        id_app: true,
        id_tarefa: true,
        id_tarefa_servico: true,
        retorno_texto: true,
        retorno_numero: true,
        retorno_opcao: true,
        taskReturn: {
          select: {
            id: true,
            returnOption: {
              select: {
                id: true,
                option: {
                  select: {
                    id: true,
                    descricao: true,
                  },
                },
              },
            },
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

    return logs;
  }

  async last(
    where?: Prisma.log_smartnewsystem_manutencao_tarefas_retornoWhereInput | null,
  ): Promise<log_smartnewsystem_manutencao_tarefas_retorno> {
    const log = await this.table.findFirst({
      orderBy: {
        id: 'desc',
      },
      where,
    });

    return log;
  }

  async lasts(
    where?: Prisma.log_smartnewsystem_manutencao_tarefas_retornoWhereInput | null,
  ): Promise<log_smartnewsystem_manutencao_tarefas_retorno[]> {
    const log = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      where,
    });

    return log;
  }

  async update(
    id: number,
    data: Prisma.log_smartnewsystem_manutencao_tarefas_retornoUncheckedUpdateInput,
  ): Promise<log_smartnewsystem_manutencao_tarefas_retorno> {
    const log = await this.table.update({
      where: { id },
      data,
    });

    return log;
  }
}
