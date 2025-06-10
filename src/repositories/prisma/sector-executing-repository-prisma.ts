import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma, sofman_cad_setor_executante } from '@prisma/client';
import { querySetSelect } from 'src/service/querySelect.service';
import { querySetFilter } from 'src/service/queryFilters.service';
import { SectorExecutingRepository } from '../sector-executing-repository';
import { ISectorExecuting } from 'src/models/ISectorExecuting';

@Injectable()
export default class SectorExecutingRepositoryPrisma
  implements SectorExecutingRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_cad_setor_executante;

  async findById(id: number): Promise<ISectorExecuting['findById'] | null> {
    const obj = await this.table.findFirst({
      select: {
        Id: true,
        id_cliente: true,
        id_grupo: true,
        descricao: true,
        padrao: true,
        log_user: true,
        log_date: true,
      },
      where: {
        Id: id,
      },
    });
    return obj;
  }

  async findByClientAndSector(
    clientId: number,
    sector: string,
  ): Promise<ISectorExecuting['findByClientAndSector'] | null> {
    const obj = await this.table.findFirst({
      select: {
        Id: true,
        id_cliente: true,
        id_grupo: true,
        descricao: true,
        padrao: true,
        log_user: true,
        log_date: true,
      },
      where: {
        id_cliente: clientId,
        descricao: sector,
      },
    });
    return obj;
  }

  async create(
    data: Prisma.sofman_cad_setor_executanteUncheckedCreateInput,
  ): Promise<sofman_cad_setor_executante> {
    const obj = await this.table.create({
      data,
    });

    return obj;
  }

  async update(
    id: number,
    data: Prisma.sofman_cad_setor_executanteUncheckedUpdateInput,
  ): Promise<sofman_cad_setor_executante> {
    const obj = await this.table.update({
      data,
      where: {
        Id: id,
      },
    });

    return obj;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        Id: id,
      },
    });

    return true;
  }

  async listByClient(
    idClient: number,
    filters: Prisma.sofman_cad_setor_executanteWhereInput = {},
    fields: string[] = [],
  ): Promise<ISectorExecuting['listByClient'][]> {
    const dataInit: Prisma.sofman_cad_setor_executanteWhereInput = {
      id_cliente: idClient,
    };
    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_cad_setor_executanteSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            Id: true,
            id_cliente: true,
            id_grupo: true,
            descricao: true,
            padrao: true,
            log_user: true,
            log_date: true,
          };

    filters = Object.keys(filters).length > 0 && querySetFilter(filters);

    const obj = await this.table.findMany({
      select: select,
      where: { ...dataInit, ...filters },
    });

    return obj;
  }
}
