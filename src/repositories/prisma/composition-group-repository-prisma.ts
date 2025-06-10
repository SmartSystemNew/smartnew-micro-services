import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_composicao_grupo } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CompositionGroupRepository } from '../composition-group-repository';

@Injectable()
export class CompositionGroupRepositoryPrisma
  implements CompositionGroupRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_composicao_grupo;

  async insert(
    data: Prisma.smartnewsystem_composicao_grupoUncheckedCreateInput,
  ): Promise<smartnewsystem_composicao_grupo> {
    const compositionGroup = await this.table.create({
      data,
    });

    return compositionGroup;
  }

  async update(
    data: Prisma.smartnewsystem_composicao_grupoUncheckedUpdateInput,
    id: number,
  ): Promise<smartnewsystem_composicao_grupo> {
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
