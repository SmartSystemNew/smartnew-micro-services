import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_numeracao_solicitacao_servico,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import NumberRequestServiceRepository from '../number-request-service-repository';

@Injectable()
export default class NumberRequestServiceRepositoryPrisma
  implements NumberRequestServiceRepository
{
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService.smartnewsystem_numeracao_solicitacao_servico;

  async countByClientAndBranch(
    clientId: number,
    branchId: number,
  ): Promise<number> {
    const numberRequest = await this.table.count({
      where: {
        id_cliente: clientId,
        id_filial: branchId,
      },
    });

    return numberRequest;
  }

  async findByClientAndBranchAndNumber(
    clientId: number,
    branchId: number,
    number: number,
  ): Promise<smartnewsystem_numeracao_solicitacao_servico | null> {
    const numberRequest = await this.table.findFirst({
      where: {
        id_cliente: clientId,
        id_filial: branchId,
        numero: number,
      },
    });

    return numberRequest;
  }

  async create(
    data: Prisma.smartnewsystem_numeracao_solicitacao_servicoUncheckedCreateInput,
  ): Promise<smartnewsystem_numeracao_solicitacao_servico> {
    const numberRequest = await this.table.create({ data });

    return numberRequest;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_numeracao_solicitacao_servicoUncheckedUpdateInput,
  ): Promise<smartnewsystem_numeracao_solicitacao_servico> {
    const numberRequest = await this.table.update({
      where: { id },
      data,
    });

    return numberRequest;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }
}
