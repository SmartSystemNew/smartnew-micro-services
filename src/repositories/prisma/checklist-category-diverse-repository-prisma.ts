import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_checklist_categoria_diverso,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import ChecklistCategoryDiverseRepository from '../checklist-category-diverse-repository';

@Injectable()
export default class ChecklistCategoryDiverseRepositoryPrisma
  implements ChecklistCategoryDiverseRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_checklist_categoria_diverso;

  async listByClient(
    clientId: number,
  ): Promise<smartnewsystem_checklist_categoria_diverso[]> {
    const category = await this.table.findMany({
      where: {
        id_cliente: clientId,
      },
    });

    return category;
  }

  async create(
    data: Prisma.smartnewsystem_checklist_categoria_diversoUncheckedCreateInput,
  ): Promise<smartnewsystem_checklist_categoria_diverso> {
    const category = await this.table.create({
      data,
    });

    return category;
  }

  async findById(
    id: number,
  ): Promise<smartnewsystem_checklist_categoria_diverso | null> {
    const category = await this.table.findUnique({
      where: {
        id,
      },
    });

    return category;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_checklist_categoria_diversoUncheckedUpdateInput,
  ): Promise<smartnewsystem_checklist_categoria_diverso> {
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
