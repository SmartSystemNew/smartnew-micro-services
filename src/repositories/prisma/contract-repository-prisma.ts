import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_contrato_numero } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { ContractRepository } from '../contract-repository';

@Injectable()
export default class ContractRepositoryPrisma implements ContractRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_contrato_numero;

  async create(
    data: Prisma.smartnewsystem_contrato_numeroUncheckedCreateInput,
  ): Promise<smartnewsystem_contrato_numero> {
    const contract = await this.table.create({ data });

    return contract;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: { id },
    });

    return true;
  }
}
