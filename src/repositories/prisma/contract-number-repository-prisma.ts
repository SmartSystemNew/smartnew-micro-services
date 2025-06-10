import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_contrato_numeracao } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { ContractNumberRepository } from '../contract-number-repository';

@Injectable()
export default class ContractNumberRepositoryPrisma
  implements ContractNumberRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_contrato_numeracao;

  async create(
    data: Prisma.smartnewsystem_contrato_numeracaoUncheckedCreateInput,
  ): Promise<smartnewsystem_contrato_numeracao> {
    const contractNumber = await this.table.create({ data });

    return contractNumber;
  }

  async findLastByClientAndBranch(
    clientId: number,
    branchId: number,
  ): Promise<number> {
    const contractNumber = await this.table.findMany({
      where: {
        id_cliente: clientId,
        id_filial: branchId,
      },
    });

    return contractNumber.length > 0
      ? contractNumber[contractNumber.length - 1].numero
      : 0;
  }
}
