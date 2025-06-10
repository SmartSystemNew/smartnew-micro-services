import { Injectable } from '@nestjs/common';
import { log_sofman_anexos_solicitacoes, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import LogAttachmentRequestServiceRepository from '../log-attachment-request-service-repository';

@Injectable()
export default class LogAttachmentRequestServiceRepositoryPrisma
  implements LogAttachmentRequestServiceRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.log_sofman_anexos_solicitacoes;

  async last(): Promise<log_sofman_anexos_solicitacoes> {
    const attachment = await this.table.findFirst({
      orderBy: { id: 'desc' },
      take: 1,
    });

    return attachment;
  }

  async listByClient(
    clientId: number,
    filter?: Prisma.log_sofman_anexos_solicitacoesWhereInput | null,
  ): Promise<log_sofman_anexos_solicitacoes[]> {
    const attachments = await this.table.findMany({
      where: {
        requestService: {
          id_cliente: clientId,
        },
        ...filter,
      },
    });

    return attachments;
  }

  async listByRequest(
    requestId: number,
    filter?: Prisma.log_sofman_anexos_solicitacoesWhereInput | null,
  ): Promise<log_sofman_anexos_solicitacoes[]> {
    const attachments = await this.table.findMany({
      where: {
        id_solicitacao: requestId,
        ...filter,
      },
    });

    return attachments;
  }

  async update(
    id: number,
    data: Prisma.log_sofman_anexos_solicitacoesUncheckedUpdateInput,
  ): Promise<log_sofman_anexos_solicitacoes> {
    const attachment = await this.table.update({
      data,
      where: {
        id: id,
      },
    });

    return attachment;
  }
}
