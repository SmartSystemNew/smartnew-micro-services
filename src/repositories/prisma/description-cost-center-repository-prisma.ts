import { Injectable } from '@nestjs/common';
import { Prisma, sofman_descricao_centro_custo } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { IDescriptionCostCenter } from 'src/models/IDescriptionCostCenter';
import { DescriptionCostCenterRepository } from '../description-cost-center-repository';

@Injectable()
export class DescriptionCostCenterRepositoryPrisma
  implements DescriptionCostCenterRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_descricao_centro_custo;

  async listByClient(
    clientId: number,
  ): Promise<IDescriptionCostCenter['listByClient'][]> {
    const description = await this.table.findMany({
      select: {
        id: true,
        descricao_centro_custo: true,
        branch: {
          select: {
            filial_numero: true,
          },
        },
      },
      where: {
        id_cliente: clientId,
      },
    });

    return description;
  }

  async listByClientComplete(
    clientId: number,
  ): Promise<IDescriptionCostCenter['listByClientComplete'][]> {
    const description = await this.table.findMany({
      select: {
        id: true,
        descricao_centro_custo: true,
        costCenter: {
          select: {
            ID: true,
            centro_custo: true,
            descricao: true,
            compositionGroup: {
              select: {
                id: true,
                composicao: true,
                descricao: true,
                compositionGroupItem: {
                  select: {
                    id: true,
                    composicao: true,
                    descricao: true,
                  },
                },
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

  async listByBranchesComplete(
    branchId: number[],
  ): Promise<IDescriptionCostCenter['listByBranchesComplete'][]> {
    const description = await this.table.findMany({
      select: {
        id: true,
        descricao_centro_custo: true,
        costCenter: {
          select: {
            ID: true,
            centro_custo: true,
            descricao: true,
            compositionGroup: {
              select: {
                id: true,
                composicao: true,
                descricao: true,
                compositionGroupItem: {
                  select: {
                    id: true,
                    composicao: true,
                    descricao: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id_filial: {
          in: branchId,
        },
      },
    });

    return description;
  }

  async listByBranch(
    branchId: number,
  ): Promise<IDescriptionCostCenter['listByBranch'][]> {
    const description = await this.table.findMany({
      select: {
        id: true,
        descricao_centro_custo: true,
        branch: {
          select: {
            filial_numero: true,
          },
        },
      },
      where: {
        id_filial: branchId,
      },
    });

    return description;
  }

  async findByClientAndBranchAndName(
    clientId: number,
    branchId: number,
    name: string,
  ): Promise<IDescriptionCostCenter['findByBranchAndName'] | null> {
    const description = await this.table.findFirst({
      select: {
        id: true,
        descricao_centro_custo: true,
      },
      where: {
        id_cliente: clientId,
        id_filial: branchId,
        descricao_centro_custo: name,
      },
    });

    return description;
  }

  async findById(
    id: number,
  ): Promise<IDescriptionCostCenter['findById'] | null> {
    const description = await this.table.findUnique({
      select: {
        id: true,
        descricao_centro_custo: true,
        branch: {
          select: {
            filial_numero: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return description;
  }

  async insert(
    data: Prisma.sofman_descricao_centro_custoUncheckedCreateInput,
  ): Promise<sofman_descricao_centro_custo> {
    const description = await this.table.create({
      data,
    });

    return description;
  }

  async update(
    data: Prisma.sofman_descricao_centro_custoUncheckedUpdateInput,
    id: number,
  ): Promise<sofman_descricao_centro_custo> {
    const description = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return description;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: { id },
    });

    return true;
  }
}
