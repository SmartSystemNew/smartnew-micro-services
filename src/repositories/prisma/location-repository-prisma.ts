import { Injectable } from '@nestjs/common';
import { Prisma, sofman_cad_localizacoes } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import LocationRepository from '../location-repository';
import { ILocation } from 'src/models/ILocation';

@Injectable()
export default class LocationRepositoryPrisma implements LocationRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_cad_localizacoes;

  async create(
    data: Prisma.sofman_cad_localizacoesUncheckedCreateInput,
  ): Promise<ILocation['create']> {
    const location = await this.table.create({
      select: {
        id: true,
        tag: true,
        localizacao: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        category: {
          select: {
            id: true,
            categoria: true,
          },
        },
      },
      data,
    });

    return location;
  }

  async findByBranchAndTag(
    branchId: number,
    tag: string,
  ): Promise<sofman_cad_localizacoes | null> {
    const location = await this.table.findFirst({
      where: {
        id_filial: branchId,
        tag,
      },
    });

    return location;
  }

  async findByBranch(
    branches: number[],
    filter?: Prisma.sofman_cad_localizacoesWhereInput | undefined,
  ): Promise<ILocation['findByBranch'][]> {
    const location = await this.table.findMany({
      select: {
        id: true,
        tag: true,
        localizacao: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        category: {
          select: {
            id: true,
            categoria: true,
          },
        },
      },
      where: {
        id_filial: {
          in: branches,
        },
        ...filter,
      },
    });

    return location;
  }

  async findByFilter(
    filter?: Prisma.sofman_cad_localizacoesWhereInput | undefined,
  ): Promise<ILocation['findByFilter'] | null> {
    const location = await this.table.findFirst({
      select: {
        id: true,
        tag: true,
        localizacao: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        category: {
          select: {
            id: true,
            categoria: true,
          },
        },
      },
      where: {
        ...filter,
      },
    });

    return location;
  }

  async findById(id: number): Promise<ILocation['findById'] | null> {
    const location = await this.table.findUnique({
      select: {
        id: true,
        tag: true,
        localizacao: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        category: {
          select: {
            id: true,
            categoria: true,
          },
        },
        checklist: {
          select: {
            id: true,
          },
        },
        modelChecklist: {
          select: {
            id: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return location;
  }

  async update(
    id: number,
    data: Prisma.sofman_cad_localizacoesUncheckedUpdateInput,
  ): Promise<sofman_cad_localizacoes> {
    const location = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return location;
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
