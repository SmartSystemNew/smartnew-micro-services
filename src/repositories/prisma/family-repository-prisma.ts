import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IFamily } from 'src/models/IFamily';
import { FamilyRepository } from '../family-repository';
import { cadastro_de_familias_de_equipamento, Prisma } from '@prisma/client';

@Injectable()
export class FamilyRepositoryPrisma implements FamilyRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.cadastro_de_familias_de_equipamento;

  async listByClient(
    clientId: number,
    filter?: Prisma.cadastro_de_familias_de_equipamentoWhereInput | null,
  ): Promise<IFamily['listByClient'][]> {
    const data = await this.table.findMany({
      select: {
        ID: true,
        ID_cliente: true,
        ID_filial: true,
        familia: true,
        observacoes: true,
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
          },
        },
      },
      where: {
        ID_cliente: {
          equals: clientId,
        },
        ...filter,
      },
    });

    return data;
  }

  async listByBranches(
    branches: number[],
  ): Promise<IFamily['listByBranches'][]> {
    const data = await this.table.findMany({
      select: {
        ID: true,
        familia: true,
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
          },
        },
      },
      where: {
        ID_filial: {
          in: branches,
        },
      },
    });

    return data;
  }

  async findById(id: number): Promise<IFamily['listByClient'] | null> {
    const family = await this.table.findUnique({
      select: {
        ID: true,
        ID_cliente: true,
        ID_filial: true,
        familia: true,
        observacoes: true,
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
          },
        },
      },
      where: {
        ID: id,
      },
    });

    return family;
  }

  async findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<cadastro_de_familias_de_equipamento | null> {
    const family = await this.table.findFirst({
      where: {
        ID_cliente: clientId,
        familia: name,
      },
    });

    return family;
  }

  async insert({
    clientId,
    family,
    branchId,
  }: {
    clientId: number;
    family: string;
    branchId?: number;
  }) {
    const data = await this.table.create({
      data: {
        ID_cliente: clientId,
        ID_filial: branchId || null,
        familia: family,
      },
    });

    return data;
  }
}
