import { Injectable } from '@nestjs/common';
import { smartnewsystem_compras_responsavel_cotacao } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import BuyResponsibleQuotationRepository from '../buy-responsible-quotation-repository';

@Injectable()
export default class BuyResponsibleQuotationRepositoryPrisma
  implements BuyResponsibleQuotationRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_responsavel_cotacao;

  async listByClient(
    clientId: number,
  ): Promise<smartnewsystem_compras_responsavel_cotacao[]> {
    const responsible = await this.table.findMany({
      where: {
        branch: {
          ID_cliente: clientId,
        },
      },
    });

    return responsible;
  }

  async listByBranches(
    branches: number[],
  ): Promise<smartnewsystem_compras_responsavel_cotacao[]> {
    const responsible = await this.table.findMany({
      where: {
        id_filial: {
          in: branches,
        },
      },
    });

    return responsible;
  }

  async listByBranchesAndLogin(
    branches: number[],
    login: string,
  ): Promise<smartnewsystem_compras_responsavel_cotacao[]> {
    const responsible = await this.table.findMany({
      where: {
        id_filial: {
          in: branches,
        },
        login: login,
      },
    });

    return responsible;
  }
}
