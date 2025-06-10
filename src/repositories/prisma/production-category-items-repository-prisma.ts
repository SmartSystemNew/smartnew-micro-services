import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IProductionCategoryItemsListByDiverse } from 'src/models/IProductionCategoryItems';
import { ProductionCategoryItemsRepository } from '../production-category-items-repository';
import { Prisma, smartnewsystem_producao_item_diversos } from '@prisma/client';

@Injectable()
export class ProductionCategoryItemsRepositoryPrisma
  implements ProductionCategoryItemsRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_producao_item_diversos;

  async listByDiverse(
    diverseId: number,
  ): Promise<IProductionCategoryItemsListByDiverse[]> {
    const item = await this.table.findMany({
      select: {
        id: true,
        nome: true,
      },
      where: {
        id_diverso: diverseId,
      },
    });

    return item;
  }

  async create(
    data: Prisma.smartnewsystem_producao_item_diversosUncheckedCreateInput,
  ): Promise<smartnewsystem_producao_item_diversos> {
    const item = await this.table.create({
      data,
    });

    return item;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_producao_item_diversosUncheckedUpdateInput,
  ): Promise<smartnewsystem_producao_item_diversos> {
    const item = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return item;
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
