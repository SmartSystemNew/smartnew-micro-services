import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_alcadas } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import ElevationRepository from '../elevation-repository';
import { IElevation } from 'src/models/IElevation';

@Injectable()
export default class ElevationRepositoryPrisma implements ElevationRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_alcadas;

  async listByBranchAndModule(
    branchId: number,
    moduleId: number,
  ): Promise<smartnewsystem_alcadas[]> {
    const elevations = await this.table.findMany({
      where: {
        id_filial: branchId,
        id_modulo: moduleId,
      },
    });

    return elevations;
  }

  async findById(id: number): Promise<IElevation['findById'] | null> {
    const elevation = await this.table.findUnique({
      select: {
        id: true,
        status_aprovador: true,
        nivel: true,
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return elevation;
  }

  async findByLoginAndModuleAndBlank(
    login: string,
    branches: number[],
    moduleId: number,
    blank: string,
  ): Promise<smartnewsystem_alcadas[]> {
    const elevation = await this.table.findMany({
      where: {
        login,
        id_modulo: moduleId,
        id_filial: {
          in: branches,
        },
        aplicacao: blank,
      },
    });

    return elevation;
  }

  async listByBranchAndModuleAndBlank(
    branchId: number,
    moduleId: number,
    blank: string,
  ): Promise<smartnewsystem_alcadas[]> {
    const elevations = await this.table.findMany({
      where: {
        id_filial: branchId,
        id_modulo: moduleId,
        aplicacao: blank,
      },
    });

    return elevations;
  }

  async listByBranchAndModuleAndBlankAndActive(
    branchId: number,
    moduleId: number,
    blank: string,
  ): Promise<smartnewsystem_alcadas[]> {
    const elevations = await this.table.findMany({
      where: {
        id_filial: branchId,
        id_modulo: moduleId,
        aplicacao: blank,
        status_aprovador: true,
      },
    });

    return elevations;
  }

  async create(
    data: Prisma.smartnewsystem_alcadasUncheckedCreateInput,
  ): Promise<smartnewsystem_alcadas> {
    const elevation = await this.table.create({
      data,
    });

    return elevation;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_alcadasUpdateInput,
  ): Promise<smartnewsystem_alcadas> {
    const elevation = await this.table.update({
      where: { id },
      data,
    });

    return elevation;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: { id },
    });

    return true;
  }
}
