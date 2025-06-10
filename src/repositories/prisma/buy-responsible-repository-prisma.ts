import { Injectable } from '@nestjs/common';
import { smartnewsystem_compras_responsavel_liberacao } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import BuyResponsibleRepository from '../buy-responsible-repository';

@Injectable()
export default class BuyResponsibleRepositoryPrisma
  implements BuyResponsibleRepository
{
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService.smartnewsystem_compras_responsavel_liberacao;

  async listBranchByUser(
    user: string,
  ): Promise<smartnewsystem_compras_responsavel_liberacao[]> {
    const responsible = await this.table.findMany({
      where: {
        responsavel: user,
      },
    });

    return responsible;
  }

  async listUserByBranch(
    branchId: number,
  ): Promise<smartnewsystem_compras_responsavel_liberacao[]> {
    const responsible = await this.table.findMany({
      where: {
        id_filial: branchId,
      },
    });

    return responsible;
  }
}
