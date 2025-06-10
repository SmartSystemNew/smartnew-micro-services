import { Injectable } from '@nestjs/common';
import { smartnewsystem_fornecedor_banco } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import ProviderBankRepository from '../provider-bank-repository';

@Injectable()
export default class ProviderBankRepositoryPrisma
  implements ProviderBankRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_fornecedor_banco;

  async listByClient(
    clientId: number,
  ): Promise<smartnewsystem_fornecedor_banco[]> {
    const provider = await this.table.findMany({
      where: {
        provider: {
          ID_cliente: clientId,
        },
      },
    });

    return provider;
  }

  async listByClientAndDefault(
    clientId: number,
  ): Promise<smartnewsystem_fornecedor_banco[]> {
    const provider = await this.table.findMany({
      where: {
        provider: {
          ID_cliente: clientId,
        },
        padrao: 1,
      },
    });

    return provider;
  }
}
