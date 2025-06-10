import { Injectable } from '@nestjs/common';
import { smartnewsystem_contrato_escopo_item } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { ContractScopeRepository } from '../contract-scope-repository';

@Injectable()
export default class ContractScopeRepositoryPrisma
  implements ContractScopeRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_contrato_escopo_item;

  async findById(id: number): Promise<smartnewsystem_contrato_escopo_item> {
    const scope = await this.table.findUnique({
      where: {
        id,
      },
    });

    return scope;
  }
}
