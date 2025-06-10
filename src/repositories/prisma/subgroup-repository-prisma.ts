import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma, sofman_subgrupos } from '@prisma/client';
import { ISubGroup } from 'src/models/ISubGroup';
import { querySetSelect } from 'src/service/querySelect.service';
import { querySetFilter } from 'src/service/queryFilters.service';
import { SubGroupRepository } from '../subgroup-repository';

@Injectable()
export default class SubGroupRepositoryPrisma implements SubGroupRepository {
  private table = this.prismaService.sofman_subgrupos;

  constructor(private prismaService: PrismaService) {}
  async findById(id: number): Promise<ISubGroup['findById'] | null> {
    const obj = await this.table.findFirst({
      select: {
        id: true,
        id_filial: true,
        descricao: true,
        users: true,
        log_user: true,
        log_date: true,
      },
      where: {
        id: id,
      },
    });

    return obj;
  }

  async create(
    data: Prisma.sofman_subgruposUncheckedCreateInput,
  ): Promise<sofman_subgrupos> {
    const obj = await this.table.create({
      data,
    });

    return obj;
  }

  async update(
    id: number,
    data: Prisma.sofman_subgruposUncheckedUpdateInput,
  ): Promise<sofman_subgrupos> {
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
    filters: Prisma.sofman_subgruposWhereInput = {},
    fields: string[] = [],
  ): Promise<ISubGroup['listByBranches'][]> {
    const where: Prisma.sofman_subgruposWhereInput = {
      id_filial: {
        in: branches,
      },
    };

    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_subgruposSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            id: true,
            id_filial: true,
            descricao: true,
            users: true,
            log_user: true,
            log_date: true,
          };

    filters = Object.keys(filters).length > 0 && querySetFilter(filters);

    const obj = await this.table.findMany({
      select: select,
      where: { ...where, ...filters },
    });

    return obj;
  }
}
