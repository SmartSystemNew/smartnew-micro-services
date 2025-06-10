import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma, sofman_descricao_planos_prev } from '@prisma/client';
import { IPlanDescription } from 'src/models/IPlanDescription';
import { querySetSelect } from 'src/service/querySelect.service';
import { querySetFilter } from 'src/service/queryFilters.service';
import { PlanDescriptionRepository } from '../plan-description-repository';

@Injectable()
export default class PlanDescriptionRepositoryPrisma
  implements PlanDescriptionRepository
{
  private table = this.prismaService.sofman_descricao_planos_prev;

  constructor(private prismaService: PrismaService) {}
  async findById(id: number): Promise<IPlanDescription['findById'] | null> {
    const obj = await this.table.findFirst({
      select: {
        id: true,
        id_cliente: true,
        id_subgrupo: true,
        filiais: true,
        id_familia: true,
        descricao: true,
        logo: true,
        log_date: true,
        log_user: true,
        familyEquipment: {
          select: {
            ID: true,
            familia: true,
          },
        },
        subGroup: {
          select: {
            id: true,
            descricao: true,
          },
        },
        plan_x_branch: {
          select: {
            id_filial: true,
          },
        },
        plans: {
          select: {
            ID: true,
            seq: true,
            id_setor_executante: true,
            id_componente: true,
            unidade_dia: true,
            periodicidade_dias: true,
            obrigatorio: true,
            Tempo_hh: true,
          },
        },
      },
      where: {
        id: id,
      },
    });

    return obj;
  }

  async create(
    data: Prisma.sofman_descricao_planos_prevUncheckedCreateInput,
  ): Promise<sofman_descricao_planos_prev> {
    const obj = await this.table.create({
      data,
    });

    return obj;
  }

  async update(
    id: number,
    data: Prisma.sofman_descricao_planos_prevUncheckedUpdateInput,
  ): Promise<sofman_descricao_planos_prev> {
    const obj = await this.table.update({
      data,
      where: {
        id: id,
      },
    });

    return obj;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id: id,
      },
    });

    return true;
  }
  async listByBranches(
    branches: number[],
    filters: Prisma.sofman_descricao_planos_prevWhereInput = {},
    fields: string[] = [],
  ): Promise<IPlanDescription['listByBranches'][]> {
    const where: Prisma.sofman_descricao_planos_prevWhereInput = {
      plan_x_branch: {
        some: {
          id_filial: {
            in: branches,
          },
        },
      },
    };

    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_descricao_planos_prevSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            id: true,
            id_cliente: true,
            id_subgrupo: true,
            filiais: true,
            id_familia: true,
            descricao: true,
            logo: true,
            log_date: true,
            log_user: true,
            familyEquipment: {
              select: {
                ID: true,
              },
            },
            subGroup: {
              select: {
                id: true,
              },
            },
            plan_x_branch: {
              select: {
                id_filial: true,
              },
            },
            plans: {
              select: {
                ID: true,
              },
            },
          };

    filters = Object.keys(filters).length > 0 && querySetFilter(filters);

    const obj = await this.table.findMany({
      select: select,
      where: { ...where, ...filters },
    });

    return obj;
  }

  async listByClient(
    idClient: number,
    filters: Prisma.sofman_descricao_planos_prevWhereInput = {},
    fields: string[] = [],
  ): Promise<IPlanDescription['listByClient'][]> {
    const where: Prisma.sofman_descricao_planos_prevWhereInput = {
      id_cliente: idClient,
    };

    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_descricao_planos_prevSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            id: true,
            id_cliente: true,
            id_subgrupo: true,
            filiais: true,
            id_familia: true,
            descricao: true,
            logo: true,
            log_date: true,
            log_user: true,
            familyEquipment: {
              select: {
                ID: true,
              },
            },
            subGroup: {
              select: {
                id: true,
              },
            },
            plan_x_branch: {
              select: {
                id_filial: true,
              },
            },
            plans: {
              select: {
                ID: true,
              },
            },
          };

    filters = Object.keys(filters).length > 0 && querySetFilter(filters);

    const obj = await this.table.findMany({
      select: select,
      where: { ...where, ...filters },
    });

    return obj;
  }
}
