import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_manutencao_deslocamento } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import IMaintenanceDisplacement from 'src/models/IMaintenanceDisplacement';
import MaintenanceDisplacementRepository from '../maintenance-displacement-repository';

@Injectable()
export default class MaintenanceDisplacementRepositoryPrisma
  implements MaintenanceDisplacementRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_manutencao_deslocamento;

  async listByOrder(
    orderById: number,
  ): Promise<IMaintenanceDisplacement['listByOrder'][]> {
    const data = await this.table.findMany({
      select: {
        id: true,
        inicio: true,
        fim: true,
        distance: true,
        distance_going: true,
        distance_return: true,
        serviceOrder: {
          select: {
            ID: true,
          },
        },
        pathDisplacement: {
          select: {
            id: true,
            tipo: true,
            latitude: true,
            longitude: true,
          },
        },
      },
      where: {
        id_ordem_servico: orderById,
      },
    });

    return data;
  }

  async listByBranches(
    branches: number[],
  ): Promise<IMaintenanceDisplacement['listByBranches'][]> {
    const data = await this.table.findMany({
      select: {
        id: true,
        inicio: true,
        fim: true,
        distance: true,
        distance_going: true,
        distance_return: true,
        serviceOrder: {
          select: {
            ID: true,
          },
        },
        pathDisplacement: {
          select: {
            id: true,
            tipo: true,
            latitude: true,
            longitude: true,
          },
        },
      },
      where: {
        serviceOrder: {
          branch: {
            ID: {
              in: branches,
            },
          },
        },
      },
    });

    return data;
  }
  async listByServiceOrder(
    id: number[],
  ): Promise<IMaintenanceDisplacement['listByServiceOrder'][]> {
    const data = await this.table.findMany({
      select: {
        id: true,
        inicio: true,
        fim: true,
        distance: true,
        distance_going: true,
        distance_return: true,
        log_date: true,
        serviceOrder: {
          select: {
            ID: true,
          },
        },
        pathDisplacement: {
          select: {
            id: true,
            tipo: true,
            latitude: true,
            longitude: true,
            log_date: true,
          },
        },
      },
      where: {
        serviceOrder: {
          ID: {
            in: id,
          },
        },
      },
    });

    return data;
  }

  async create(
    data: Prisma.smartnewsystem_manutencao_deslocamentoUncheckedCreateInput,
  ): Promise<smartnewsystem_manutencao_deslocamento> {
    const displacement = await this.table.create({ data });

    return displacement;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_manutencao_deslocamentoUncheckedUpdateInput,
  ): Promise<smartnewsystem_manutencao_deslocamento> {
    const displacement = await this.table.update({
      where: { id },
      data,
    });

    return displacement;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }
}
