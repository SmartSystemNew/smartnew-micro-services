import { Injectable } from '@nestjs/common';
import { Prisma, sofman_cad_acoes } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { IFailureAction } from 'src/models/IFailureAction';
import { querySetFilter } from 'src/service/queryFilters.service';
import { querySetSelect } from 'src/service/querySelect.service';
import { FailureActionRepository } from '../failure-action-repository';

@Injectable()
export default class FailureActionRepositoryPrisma
  implements FailureActionRepository
{
  private table = this.prismaService.sofman_cad_acoes;

  constructor(private prismaService: PrismaService) {}
  async findById(id: number): Promise<IFailureAction['findById'] | null> {
    const obj = await this.table.findFirst({
      select: {
        id: true,
        id_cliente: true,
        descricao: true,
        log_user: true,
        log_date: true,
        failureAnalysis: {
          select: { id: true },
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
    data: Prisma.sofman_cad_acoesUncheckedCreateInput,
  ): Promise<sofman_cad_acoes> {
    const obj = await this.table.create({
      data,
    });

    return obj;
  }

  async update(
    id: number,
    data: Prisma.sofman_cad_acoesUncheckedUpdateInput,
  ): Promise<sofman_cad_acoes> {
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
    filters: Prisma.sofman_cad_acoesWhereInput = {},
    fields: string[] = [],
  ): Promise<IFailureAction['listByClient'][]> {
    const where: Prisma.sofman_cad_acoesWhereInput = {
      id_cliente: idClient,
    };

    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_cad_acoesSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            id: true,
            id_cliente: true,
            descricao: true,
            log_user: true,
            log_date: true,
            failureAnalysis: {
              select: { id: true },
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
