import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_producao_categoria_diversos,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import {
  IProductionCategoryDiverseFindById,
  IProductionCategoryDiverseListByClient,
} from 'src/models/IProductionCategoryDiverse';
import ProductionCategoryDiverseRepository from '../production-category-diverse-repository';

@Injectable()
export class ProductionCategoryDiverseRepositoryPrisma
  implements ProductionCategoryDiverseRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_producao_categoria_diversos;

  async findById(
    id: number,
  ): Promise<IProductionCategoryDiverseFindById | null> {
    const category = await this.table.findFirst({
      select: {
        id: true,
        nome: true,
        branch: {
          select: {
            ID: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return category;
  }

  async listByClient(
    clientId: number,
  ): Promise<IProductionCategoryDiverseListByClient[]> {
    const category = await this.table.findMany({
      select: {
        id: true,
        nome: true,
        branch: {
          select: {
            ID: true,
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
      },
      where: {
        id_cliente: clientId,
      },
    });

    return category;
  }

  async create(
    data: Prisma.smartnewsystem_producao_categoria_diversosUncheckedCreateInput,
  ): Promise<smartnewsystem_producao_categoria_diversos> {
    const category = await this.table.create({
      data,
    });

    return category;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_producao_categoria_diversosUncheckedUpdateInput,
  ): Promise<smartnewsystem_producao_categoria_diversos> {
    const category = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return category;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
