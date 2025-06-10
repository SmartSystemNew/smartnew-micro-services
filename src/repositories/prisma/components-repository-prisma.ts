import { Injectable } from '@nestjs/common';
import { Prisma, sofman_cad_componentes } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { IComponents } from 'src/models/IComponents';
import { querySetFilter } from 'src/service/queryFilters.service';
import { querySetSelect } from 'src/service/querySelect.service';
import { ComponentsRepository } from '../components-repository';

@Injectable()
export default class ComponentsRepositoryPrisma
  implements ComponentsRepository
{
  private table = this.prismaService.sofman_cad_componentes;

  constructor(private prismaService: PrismaService) {}
  async findById(id: number): Promise<IComponents['findById'] | null> {
    const obj = await this.table.findFirst({
      select: {
        id: true,
        id_cliente: true,
        componente: true,
        observacoes: true,
        log_user: true,
        log_date: true,
        failureAnalysis: {
          select: { id: true },
        },
        company: { select: { ID: true, razao_social: true } },
        planPrev: { select: { ID: true } },
        taskServiceOrder: { select: { id: true } },
        taskPlanMaintenance: { select: { id: true } },
      },
      where: {
        id: id,
      },
    });

    return obj;
  }

  async create(
    data: Prisma.sofman_cad_componentesUncheckedCreateInput,
  ): Promise<sofman_cad_componentes> {
    const obj = await this.table.create({
      data,
    });

    return obj;
  }

  async update(
    id: number,
    data: Prisma.sofman_cad_componentesUncheckedUpdateInput,
  ): Promise<sofman_cad_componentes> {
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
    filters: Prisma.sofman_cad_componentesWhereInput = {},
    fields: string[] = [],
  ): Promise<IComponents['listByClient'][]> {
    const where: Prisma.sofman_cad_componentesWhereInput = {
      id_cliente: idClient,
    };

    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_cad_componentesSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            id: true,
            id_cliente: true,
            componente: true,
            observacoes: true,
            log_user: true,
            log_date: true,
            failureAnalysis: {
              select: { id: true },
            },
            company: { select: { ID: true, razao_social: true } },
            planPrev: { select: { ID: true } },
            taskServiceOrder: { select: { id: true } },
            taskPlanMaintenance: { select: { id: true } },
          };

    filters = Object.keys(filters).length > 0 && querySetFilter(filters);

    const obj = await this.table.findMany({
      select: select,
      where: { ...where, ...filters },
    });
    return obj;
  }
}
