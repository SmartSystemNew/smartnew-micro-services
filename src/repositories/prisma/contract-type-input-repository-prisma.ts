import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IContractTypeInput } from 'src/models/IContractTypeInput';
import ContractTypeInputRepository from '../contract-type-input-repository';
import { Prisma, smartnewsystem_contrato_tipo_insumo } from '@prisma/client';

@Injectable()
export default class ContractTypeInputRepositoryPrisma
  implements ContractTypeInputRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_contrato_tipo_insumo;

  async create(
    data: Prisma.smartnewsystem_contrato_tipo_insumoUncheckedCreateInput,
  ): Promise<smartnewsystem_contrato_tipo_insumo> {
    const item = await this.table.create({ data });

    return item;
  }

  async listByClient(
    clientId: number,
  ): Promise<IContractTypeInput['listByClient'][]> {
    const input = await this.table.findMany({
      select: {
        id: true,
        insumo: true,
      },
      where: {
        id_cliente: clientId,
      },
    });

    return input;
  }

  async findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<IContractTypeInput['findByClientAndName'] | null> {
    const input = await this.table.findFirst({
      select: {
        id: true,
        insumo: true,
      },
      where: {
        id_cliente: clientId,
        insumo: name,
      },
    });

    return input;
  }

  async findById(id: number): Promise<IContractTypeInput['findById'] | null> {
    const input = await this.table.findUnique({
      select: {
        id: true,
        insumo: true,
      },
      where: {
        id,
      },
    });

    return input;
  }
}
