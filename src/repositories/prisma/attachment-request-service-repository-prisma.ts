import { Injectable } from '@nestjs/common';
import { Prisma, sofman_anexos_solicitacoes } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import AttachmentRequestServiceRepository from '../attachment-request-service-repository';

@Injectable()
export default class AttachmentRequestServiceRepositoryPrisma
  implements AttachmentRequestServiceRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_anexos_solicitacoes;

  async findById(id: number): Promise<sofman_anexos_solicitacoes | null> {
    const attachment = await this.table.findUnique({
      where: { id },
    });

    return attachment;
  }

  async create(
    data: Prisma.sofman_anexos_solicitacoesUncheckedCreateInput,
  ): Promise<sofman_anexos_solicitacoes> {
    const attachment = await this.table.create({ data });
    return attachment;
  }

  async listRequest(requestId: number): Promise<sofman_anexos_solicitacoes[]> {
    const attachments = await this.table.findMany({
      where: { id_solicitacao: requestId },
    });

    return attachments;
  }

  async update(
    id: number,
    data: Prisma.sofman_anexos_solicitacoesUncheckedUpdateInput,
  ): Promise<sofman_anexos_solicitacoes> {
    const attachment = await this.table.update({ data, where: { id } });
    return attachment;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });
    return true;
  }
}
