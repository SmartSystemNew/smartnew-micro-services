import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  IBranch,
  IBranchByUser,
  IListByClientAndBranch,
} from 'src/models/IBranch';
import { BranchesByUserRepository } from '../branches-by-user-repository';

@Injectable()
export class BranchesByUserRepositoryPrisma
  implements BranchesByUserRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_filiais_x_usuarios;

  async listByClientAndUser(
    clientId: number,
    login: string,
  ): Promise<IBranchByUser[]> {
    const data = await this.table.findMany({
      select: {
        id_filial: true,
        branch: {
          select: {
            filial_numero: true,
            cnpj: true,
          },
        },
      },
      where: {
        id_cliente: {
          equals: clientId,
        },
        AND: {
          id_user: {
            equals: login,
          },
        },
        branch: {
          status: 1,
        },
      },
    });

    return data;
  }

  async listByClientAndUserForPage(
    clientId: number,
    login: string,
    index: number | null,
    perPage: number | null,
    search?: string | null,
  ): Promise<IBranch['listByClientAndUserForPage'][]> {
    const data = await this.table.findMany({
      ...(index != null && {
        skip: index * perPage,
        take: perPage,
      }),
      select: {
        branch: {
          select: {
            ID: true,
            filial_numero: true,
            cnpj: true,
          },
        },
      },
      where: {
        id_cliente: {
          equals: clientId,
        },
        AND: {
          id_user: {
            equals: login,
          },
        },
        branch: {
          status: 1,
          ...(search && {
            filial_numero: {
              contains: search,
            },
          }),
        },
      },
    });

    return data;
  }

  async countListByClientAndUserForPage(
    clientId: number,
    login: string,
    search?: string | null,
  ): Promise<number> {
    const data = await this.table.count({
      where: {
        id_cliente: {
          equals: clientId,
        },
        AND: {
          id_user: {
            equals: login,
          },
        },
        branch: {
          status: 1,
          ...(search && {
            filial_numero: {
              contains: search,
            },
          }),
        },
      },
    });

    return data || 0;
  }

  async listByClientAndBranch(
    clientId: number,
    branchId: number,
  ): Promise<IListByClientAndBranch[]> {
    const data = await this.table.findMany({
      select: {
        user: {
          select: {
            login: true,
            name: true,
          },
        },
      },
      where: {
        id_cliente: clientId,
        id_filial: branchId,
        branch: {
          status: 1,
        },
      },
    });

    return data;
  }
}
