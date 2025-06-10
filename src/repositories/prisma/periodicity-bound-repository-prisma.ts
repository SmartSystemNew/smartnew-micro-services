import { Injectable } from '@nestjs/common';
import { smartnewsystem_checklist_tipo_periocidade } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import PeriodicityBoundRepository from '../periodicity-bound-repository';

@Injectable()
export default class PeriodicityBoundRepositoryPrisma
  implements PeriodicityBoundRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_checklist_tipo_periocidade;

  async list(): Promise<smartnewsystem_checklist_tipo_periocidade[]> {
    const periods = await this.table.findMany();

    return periods;
  }

  async findById(
    id: number,
  ): Promise<smartnewsystem_checklist_tipo_periocidade | null> {
    const periods = await this.table.findFirst({
      where: {
        id,
      },
    });

    return periods;
  }
}
