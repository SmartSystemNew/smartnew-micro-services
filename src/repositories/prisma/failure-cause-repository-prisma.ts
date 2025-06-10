import { Injectable } from '@nestjs/common';
import { Prisma, sofman_cad_causas } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { IFailureCause } from 'src/models/IFailureCause';
import { querySetFilter } from 'src/service/queryFilters.service';
import { querySetSelect } from 'src/service/querySelect.service';
import { FailureCauseRepository } from '../failure-cause-repository';

@Injectable()
export default class FailureCauseRepositoryPrisma
  implements FailureCauseRepository
{
  private table = this.prismaService.sofman_cad_causas;

  constructor(private prismaService: PrismaService) {}
  async findById(id: number): Promise<IFailureCause['findById'] | null> {
    const obj = await this.table.findFirst({
      select: {
        id: true,
        id_cliente: true,
        descricao: true,
        log_user: true,
        log_date: true,
        serviceOrder: {
          select: {
            ID: true,
            ordem: true,
          },
        },
        failureAnalysis: {
          select: {
            id: true,
          },
        },
        noteStop: {
          select: {
            id: true,
          },
        },
        company: {
          select: {
            ID: true,
            razao_social: true,
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
    data: Prisma.sofman_cad_causasUncheckedCreateInput,
  ): Promise<sofman_cad_causas> {
    const obj = await this.table.create({
      data,
    });

    return obj;
  }

  async update(
    id: number,
    data: Prisma.sofman_cad_causasUncheckedUpdateInput,
  ): Promise<sofman_cad_causas> {
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
  async listByClient(
    idClient: number,
    filters: Prisma.sofman_cad_causasWhereInput = {},
    fields: string[] = [],
  ): Promise<IFailureCause['listByClient'][]> {
    const where: Prisma.sofman_cad_causasWhereInput = {
      id_cliente: idClient,
    };

    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_cad_causasSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            id: true,
            id_cliente: true,
            descricao: true,
            log_user: true,
            log_date: true,
            serviceOrder: {
              select: {
                ID: true,
                ordem: true,
              },
            },
            failureAnalysis: {
              select: {
                id: true,
              },
            },
            noteStop: {
              select: {
                id: true,
              },
            },
            company: {
              select: {
                ID: true,
                razao_social: true,
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
