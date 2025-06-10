import { Injectable } from '@nestjs/common';
import { log_sofman_anexos_os, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import LogAttachmentServiceOrderRepository from '../log-attachment-service-order-repository';

@Injectable()
export default class LogAttachmentServiceOrderRepositoryPrisma
  implements LogAttachmentServiceOrderRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.log_sofman_anexos_os;

  async listByClient(
    clientId: number,
    filter?: Prisma.log_sofman_anexos_osWhereInput | null,
  ): Promise<log_sofman_anexos_os[]> {
    return await this.table.findMany({
      where: {
        id_cliente: clientId,
        ...filter,
      },
    });
  }

  async listByOrder(
    orderId: number,
    filter?: Prisma.log_sofman_anexos_osWhereInput | null,
  ): Promise<log_sofman_anexos_os[]> {
    return await this.table.findMany({
      where: {
        id_ordem_servico: orderId,
        ...filter,
      },
    });
  }
}
