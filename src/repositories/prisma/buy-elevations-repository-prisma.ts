import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_compras_controle_alcadas,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import BuyElevationsRepository from '../buy-elevations-repository';
import { IBuyElevation } from 'src/models/IBuyElevations';

@Injectable()
export default class BuyElevationsRepositoryPrisma
  implements BuyElevationsRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_controle_alcadas;

  async create(
    data: Prisma.smartnewsystem_compras_controle_alcadasUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_controle_alcadas> {
    const elevations = await this.table.create({
      data,
    });

    return elevations;
  }

  async listElevations(
    branch: number,
  ): Promise<smartnewsystem_compras_controle_alcadas[]> {
    const elevations = await this.table.findMany({
      select: {
        id: true,
        id_cliente: true,
        id_filial: true,
        limite_valor: true,
        num_fornecedores: true,
        num_aprovadores: true,
        justificativa: true,
        urgente: true,
      },
      where: {
        id_filial: branch,
      },
    });

    return elevations;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_compras_controle_alcadasUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_controle_alcadas> {
    const elevations = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return elevations;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id,
      },
    });

    return true;
  }

  async findByFilial(clientId: number): Promise<any[]> {
    const elevations = await this.prismaService.smartnewsystem_alcadas.findMany(
      {
        where: {
          user: {
            id_cliente: clientId,
          },
        },
        include: {
          branch: true, //Aqui eu to pegando todas as filias do cliente logado
          user: true, // Pega os dados do usuário aprovador de cada filial
        },
      },
    );

    // Para não me perder: Aqui estou agrupando os dados por filial
    const groupedData = elevations.reduce((acc, row) => {
      let filial = acc.find((f) => f.id === row.id_filial);

      if (!filial) {
        filial = {
          id: row.id_filial!,
          name: row.branch?.filial_numero || 'Desconhecido',
        };
        acc.push(filial);
      }

      return acc;
    }, []);

    return groupedData;
  }

  async listByBranches(
    branchesId: number[],
  ): Promise<IBuyElevation['listByBranches'][]> {
    const elevations = await this.prismaService.smartnewsystem_alcadas.findMany(
      {
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
          id_filial: {
            in: branchesId,
          },
        },
      },
    );

    return elevations;
  }

  async listByBranch(
    branch_id: number,
  ): Promise<IBuyElevation['listByBranch'][]> {
    const elevations = await this.prismaService.smartnewsystem_alcadas.findMany(
      {
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
          id_filial: branch_id,
        },
      },
    );

    return elevations;
  }
}
