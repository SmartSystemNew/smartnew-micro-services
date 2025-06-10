import { Injectable } from '@nestjs/common';
import { smartnewsystem_compras_pedido_status } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import BuyRequestStatusRepository from '../buy-request-status-repository';

@Injectable()
export default class BuyRequestStatusRepositoryPrisma
  implements BuyRequestStatusRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_pedido_status;

  async listClient(
    clientId: number,
  ): Promise<smartnewsystem_compras_pedido_status[]> {
    const status = await this.table.findMany({
      where: {
        id_cliente: clientId,
      },
    });

    return status;
  }

  async findById(id: number): Promise<smartnewsystem_compras_pedido_status> {
    const status = await this.table.findUnique({
      where: {
        id,
      },
    });

    return status;
  }
}
