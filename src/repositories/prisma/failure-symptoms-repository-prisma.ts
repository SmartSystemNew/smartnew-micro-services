import { Injectable } from '@nestjs/common';
import { Prisma, sofman_cad_sintomas } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { IFailureSymptoms } from 'src/models/IFailureSymptoms';
import { querySetFilter } from 'src/service/queryFilters.service';
import { querySetSelect } from 'src/service/querySelect.service';
import { FailureSymptomsRepository } from '../failure-symptoms-repository';

@Injectable()
export default class FailureSymptomsRepositoryPrisma
  implements FailureSymptomsRepository
{
  private table = this.prismaService.sofman_cad_sintomas;

  constructor(private prismaService: PrismaService) {}
  async findById(id: number): Promise<IFailureSymptoms['findById'] | null> {
    const obj = await this.table.findFirst({
      select: {
        id: true,
        id_cliente: true,
        descricao: true,
        log_user: true,
        log_date: true,
        failureAnalysis: { select: { id: true } },
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
    data: Prisma.sofman_cad_sintomasUncheckedCreateInput,
  ): Promise<sofman_cad_sintomas> {
    const obj = await this.table.create({
      data,
    });

    return obj;
  }

  async update(
    id: number,
    data: Prisma.sofman_cad_sintomasUncheckedUpdateInput,
  ): Promise<sofman_cad_sintomas> {
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
    filters: Prisma.sofman_cad_sintomasWhereInput = {},
    fields: string[] = [],
  ): Promise<IFailureSymptoms['listByClient'][]> {
    const where: Prisma.sofman_cad_sintomasWhereInput = {
      id_cliente: idClient,
    };

    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_cad_sintomasSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            id: true,
            id_cliente: true,
            descricao: true,
            log_user: true,
            log_date: true,
            failureAnalysis: { select: { id: true } },
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
