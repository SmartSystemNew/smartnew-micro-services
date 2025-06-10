import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_composicao_item } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CompositionItemRepository } from '../composition-item-repository';

@Injectable()
export class CompositionItemRepositoryPrisma
  implements CompositionItemRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_composicao_item;

  async findById(id: number): Promise<smartnewsystem_composicao_item | null> {
    const compositionItem = await this.table.findUnique({
      where: {
        id,
      },
    });

    return compositionItem;
  }

  async insert(
    data: Prisma.smartnewsystem_composicao_itemUncheckedCreateInput,
  ): Promise<smartnewsystem_composicao_item> {
    const compositionGroup = await this.table.create({
      data,
    });

    return compositionGroup;
  }

  async update(
    data: Prisma.smartnewsystem_composicao_itemUncheckedUpdateInput,
    id: number,
  ): Promise<smartnewsystem_composicao_item> {
    const compositionGroup = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return compositionGroup;
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
