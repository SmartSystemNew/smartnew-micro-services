import { Injectable } from '@nestjs/common';
import { smartnewsystem_contrato_status_contrato } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { ContractStatusRepository } from '../contract-status-repository';

@Injectable()
export default class ContractStatusRepositoryPrisma
  implements ContractStatusRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_contrato_status_contrato;

  async findOpen(
    clientId: number,
  ): Promise<smartnewsystem_contrato_status_contrato | null> {
    const status = await this.table.findFirst({
      where: {
        id_cliente: clientId,
        finalizacao: 0,
      },
    });

    return status;
  }
}
