import { Injectable } from '@nestjs/common';
import { smartnewsystem_manutencao_controle_fechamento_ordem_servico } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import ControlClosedOrderServiceRepository from '../control-closed-order-service-repository';

@Injectable()
export default class ControlClosedOrderServiceRepositoryPrisma
  implements ControlClosedOrderServiceRepository
{
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService
      .smartnewsystem_manutencao_controle_fechamento_ordem_servico;

  async findByClient(
    clientId: number,
  ): Promise<smartnewsystem_manutencao_controle_fechamento_ordem_servico | null> {
    const controlCloseOrder = await this.table.findFirst({
      where: {
        id_cliente: clientId,
      },
    });

    return controlCloseOrder;
  }
}
