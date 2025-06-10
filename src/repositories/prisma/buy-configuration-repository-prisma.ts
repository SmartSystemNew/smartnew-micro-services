import { Injectable } from '@nestjs/common';
import { smartnewsystem_compras_configuracao } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import BuyConfigurationRepository from '../buy-configuration-repository';

@Injectable()
export default class BuyConfigurationRepositoryPrisma
  implements BuyConfigurationRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_configuracao;

  async findByClient(
    clientId: number,
  ): Promise<smartnewsystem_compras_configuracao | null> {
    const configBuy = await this.table.findFirst({
      where: {
        id_cliente: clientId,
      },
    });

    return configBuy;
  }
}
