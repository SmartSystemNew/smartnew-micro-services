import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_manutencao_tarefa_servico_anexo,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import AttachmentTaskServiceRepository from '../attachment-task-service-repository';
import IAttachmentTaskService from 'src/models/IAttachmentTaskService';

@Injectable()
export default class AttachmentTaskServiceRepositoryPrisma
  implements AttachmentTaskServiceRepository
{
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService.smartnewsystem_manutencao_tarefa_servico_anexo;

  async findByTask(
    taskId: number,
  ): Promise<smartnewsystem_manutencao_tarefa_servico_anexo[]> {
    const attachments = await this.table.findMany({
      where: {
        taskService: {
          id: taskId,
        },
      },
    });

    return attachments;
  }

  async findById(
    id: number,
  ): Promise<IAttachmentTaskService['findById'] | null> {
    const attachments = await this.table.findFirst({
      select: {
        id: true,
        anexo: true,
        id_app: true,
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
        id,
      },
    });

    return attachments;
  }

  async create(
    data: Prisma.smartnewsystem_manutencao_tarefa_servico_anexoUncheckedCreateInput,
  ): Promise<smartnewsystem_manutencao_tarefa_servico_anexo> {
    const attachment = await this.table.create({ data });

    return attachment;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_manutencao_tarefa_servico_anexoUncheckedUpdateInput,
  ): Promise<smartnewsystem_manutencao_tarefa_servico_anexo> {
    const attachment = await this.table.update({
      where: { id },
      data,
    });

    return attachment;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }
}
