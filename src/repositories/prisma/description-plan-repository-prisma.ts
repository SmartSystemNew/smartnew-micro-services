import { Injectable } from '@nestjs/common';
import { Prisma, sofman_descricao_planos_prev } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import DescriptionPlanRepository from '../description-plan-repository';
import IDescriptionPlan from 'src/models/IDescriptionPlan';

@Injectable()
export default class DescriptionPlanRepositoryPrisma
  implements DescriptionPlanRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_descricao_planos_prev;

  async listByClient(
    clientId: number,
  ): Promise<sofman_descricao_planos_prev[]> {
    const description = await this.table.findMany({
      where: {
        id_cliente: clientId,
      },
    });

    return description;
  }

  async listByClientWithTask(
    clientId: number,
  ): Promise<IDescriptionPlan['listByClientWithTask'][]> {
    const description = await this.table.findMany({
      select: {
        id: true,
        descricao: true,
        plans: {
          select: {
            ID: true,
            task: {
              select: {
                id: true,
                tarefa: true,
              },
            },
          },
        },
      },
      where: {
        id_cliente: clientId,
      },
    });

    return description;
  }

  async create(
    data: Prisma.sofman_descricao_planos_prevUncheckedCreateInput,
  ): Promise<sofman_descricao_planos_prev> {
    const description = await this.table.create({ data });

    return description;
  }

  async findById(id: number): Promise<IDescriptionPlan['findById'] | null> {
    const description = await this.table.findUnique({
      select: {
        id: true,
        descricao: true,
        plans: {
          select: {
            ID: true,
            task: {
              select: {
                id: true,
                tarefa: true,
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });

    return description;
  }

  async update(
    id: number,
    data: Prisma.sofman_descricao_planos_prevUncheckedUpdateInput,
  ): Promise<sofman_descricao_planos_prev> {
    const description = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return description;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }
}
