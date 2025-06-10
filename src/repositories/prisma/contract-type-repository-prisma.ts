import { Injectable } from '@nestjs/common';
import { smartnewsystem_contrato_tipo_contrato } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import ContractTypeRepository from '../contract-type-repository';

@Injectable()
export default class ContractTypeRepositoryPrisma
  implements ContractTypeRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_contrato_tipo_contrato;

  async listByClient(
    clientId: number,
  ): Promise<smartnewsystem_contrato_tipo_contrato[]> {
    const type = await this.table.findMany({
      where: {
        id_cliente: clientId,
      },
    });

    return type;
  }

  async findById(
    id: number,
  ): Promise<smartnewsystem_contrato_tipo_contrato | null> {
    const type = await this.table.findUnique({
      where: {
        id,
      },
    });

    return type;
  }
}
