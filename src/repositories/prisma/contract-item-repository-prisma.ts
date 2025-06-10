import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_contrato_dados } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export default class ContractItemRepositoryPrisma {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_contrato_dados;

  async create(
    data: Prisma.smartnewsystem_contrato_dadosUncheckedCreateInput,
  ): Promise<smartnewsystem_contrato_dados> {
    const item = await this.table.create({ data });

    return item;
  }
}
