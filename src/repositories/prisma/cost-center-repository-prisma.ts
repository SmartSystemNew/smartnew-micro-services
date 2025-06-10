import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ICostCenter } from 'src/models/ICostCenter';
import { CostCenterRepository } from '../cost-center-repository';
import { Prisma, cadastro_de_centros_de_custo } from '@prisma/client';

@Injectable()
export class CostCenterRepositoryPrisma implements CostCenterRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.cadastro_de_centros_de_custo;

  async countByDescription(descriptionId: number): Promise<number> {
    const count = await this.table.count({
      select: {
        ID: true,
      },
      where: {
        ID_centro_custo: descriptionId,
      },
    });

    return count.ID || 0;
  }

  async byBranches(
    branches: number[],
    filter?: Prisma.cadastro_de_centros_de_custoWhereInput | null,
  ): Promise<ICostCenter['byBranch'][]> {
    const costCenter = await this.table.findMany({
      select: {
        ID: true,
        centro_custo: true,
        descricao: true,
        log_date: true,
        descriptionCostCenter: {
          select: {
            descricao_centro_custo: true,
            branch: {
              select: {
                filial_numero: true,
              },
            },
          },
        },
      },
      where: {
        descriptionCostCenter: {
          branch: {
            ID: {
              in: branches,
            },
          },
        },
        ...filter,
      },
    });

    return costCenter;
  }

  async byDescription(
    descriptionId: number,
  ): Promise<ICostCenter['byDescription'][]> {
    const costCenter = await this.table.findMany({
      select: {
        ID: true,
        centro_custo: true,
        descricao: true,
        descriptionCostCenter: {
          select: {
            descricao_centro_custo: true,
            branch: {
              select: {
                filial_numero: true,
              },
            },
          },
        },
      },
      where: {
        ID_centro_custo: descriptionId,
      },
    });

    return costCenter;
  }

  async byClient(clientId: number): Promise<ICostCenter['byDescription'][]> {
    const costCenter = await this.table.findMany({
      select: {
        ID: true,
        centro_custo: true,
        descricao: true,
        descriptionCostCenter: {
          select: {
            descricao_centro_custo: true,
            branch: {
              select: {
                filial_numero: true,
              },
            },
          },
        },
      },
      where: {
        ID_cliente: clientId,
      },
    });

    return costCenter;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        ID: id,
      },
    });

    return true;
  }

  async findById(id: number): Promise<ICostCenter['findById']> {
    const costCenter = await this.table.findUnique({
      select: {
        ID: true,
        centro_custo: true,
        descricao: true,
        descriptionCostCenter: {
          select: {
            descricao_centro_custo: true,
            branch: {
              select: {
                filial_numero: true,
              },
            },
          },
        },
      },
      where: {
        ID: id,
      },
    });

    return costCenter;
  }

  async findByDescriptionAndCodeAndName(
    descriptionId: number,
    code: string,
    name: string,
  ): Promise<ICostCenter['findByDescriptionAndCodeAndName'] | null> {
    const costCenter = await this.table.findFirst({
      select: {
        ID: true,
        centro_custo: true,
        descricao: true,
        descriptionCostCenter: {
          select: {
            descricao_centro_custo: true,
            branch: {
              select: {
                filial_numero: true,
              },
            },
          },
        },
      },
      where: {
        ID_centro_custo: descriptionId,
        centro_custo: code,
        descricao: name,
      },
    });

    return costCenter;
  }

  async findByDescriptionAndName(
    descriptionId: number,
    name: string,
  ): Promise<ICostCenter['findByDescriptionAndName'] | null> {
    const costCenter = await this.table.findFirst({
      select: {
        ID: true,
        centro_custo: true,
        descricao: true,
        descriptionCostCenter: {
          select: {
            descricao_centro_custo: true,
            branch: {
              select: {
                filial_numero: true,
              },
            },
          },
        },
      },
      where: {
        ID_centro_custo: descriptionId,
        descricao: name,
      },
    });

    return costCenter;
  }

  async insert(
    data: Prisma.cadastro_de_centros_de_custoUncheckedCreateInput,
  ): Promise<cadastro_de_centros_de_custo> {
    const costCenter = await this.table.create({
      data,
    });

    return costCenter;
  }

  async listCostCenter(
    range: number[],
  ): Promise<ICostCenter['listCostCenter'][]> {
    const data = await this.table.findMany({
      select: {
        ID: true,
        centro_custo: true,
        descricao: true,
      },
      where: {
        descriptionCostCenter: {
          id_filial: {
            in: range,
          },
        },
      },
    });

    return data;
  }

  async listCostCenterActive(
    range: number[],
  ): Promise<ICostCenter['listCostCenterActive'][]> {
    const data = await this.table.findMany({
      select: {
        ID: true,
        centro_custo: true,
        descricao: true,
      },
      where: {
        descriptionCostCenter: {
          id_filial: {
            in: range,
          },
        },
        ativo: 1,
      },
    });

    return data;
  }

  async update(
    data: Prisma.cadastro_de_centros_de_custoUncheckedUpdateInput,
    id: number,
  ): Promise<cadastro_de_centros_de_custo> {
    const costCenter = await this.table.update({
      data,
      where: {
        ID: id,
      },
    });

    return costCenter;
  }
}
