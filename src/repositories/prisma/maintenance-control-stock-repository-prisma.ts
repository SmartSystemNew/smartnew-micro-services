import { Injectable } from '@nestjs/common';
import { smartnewsystem_manutencao_controle_estoque } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import MaintenanceControlStockRepository from '../maintenance-control-stock-repository';

@Injectable()
export default class MaintenanceControlStockRepositoryPrisma
  implements MaintenanceControlStockRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_manutencao_controle_estoque;

  async listByClient(
    clientId: number,
  ): Promise<smartnewsystem_manutencao_controle_estoque[]> {
    const controlStocks = await this.table.findMany({
      where: {
        id_cliente: clientId,
      },
    });

    return controlStocks;
  }
}
