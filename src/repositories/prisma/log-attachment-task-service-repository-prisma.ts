import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import LogAttachmentTaskServiceRepository from '../log-attachment-task-service-repository';
import ILogAttachmentTaskServiceOrder from 'src/models/ILogAttachmentTaskService';

@Injectable()
export default class LogAttachmentTaskServiceRepositoryPrisma
  implements LogAttachmentTaskServiceRepository
{
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService.log_smartnewsystem_manutencao_tarefa_servico_anexo;

  async listByBranch(
    branches: number[],
    filter?: Prisma.log_smartnewsystem_manutencao_tarefa_servico_anexoWhereInput | null,
  ): Promise<ILogAttachmentTaskServiceOrder['listByBranch'][]> {
    const logs = await this.table.findMany({
      select: {
        id: true,
        acao: true,
        id_anexo: true,
        id_tarefa_servico: true,
        anexo: true,
        url: true,
        observacao: true,
        id_app: true,
        log_date: true,
        taskService: {
          select: {
            id: true,
            serviceOrder: {
              select: {
                ID: true,
              },
            },
          },
        },
      },
      where: {
        taskService: {
          serviceOrder: {
            branch: {
              ID: {
                in: branches,
              },
            },
          },
        },
        ...filter,
      },
    });

    return logs;
  }
}
