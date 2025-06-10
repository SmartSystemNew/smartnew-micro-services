import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma, sofman_status_ordem_servico } from '@prisma/client';

import { querySetSelect } from 'src/service/querySelect.service';
import { querySetFilter } from 'src/service/queryFilters.service';
import { IServiceOrderStatus } from 'src/models/IServiceOrderStatus';
import { StatusServiceOrderRepository } from '../status-service-order-repository';

@Injectable()
export default class StatusServiceOrderRepositoryPrisma
  implements StatusServiceOrderRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_status_ordem_servico;

  async findById(id: number): Promise<IServiceOrderStatus['findById'] | null> {
    const obj = await this.table.findFirst({
      select: {
        id: true,
        id_cliente: true,
        status: true,
        requer_justificativa: true,
        notifica_solicitante: true,
        cor: true,
        cor_font: true,
        finalizacao: true,
        mostra_mantenedor: true,
      },
      where: {
        id: id,
      },
    });
    return obj;
  }

  async findByClientAndStatus(
    clientId: number,
    status: string,
  ): Promise<IServiceOrderStatus['findByClientAndStatus'] | null> {
    const obj = await this.table.findFirst({
      select: {
        id: true,
        id_cliente: true,
        status: true,
        requer_justificativa: true,
        notifica_solicitante: true,
        cor: true,
        cor_font: true,
        finalizacao: true,
        mostra_mantenedor: true,
      },
      where: {
        id_cliente: clientId,
        status: status,
      },
    });
    return obj;
  }

  async create(
    data: Prisma.sofman_status_ordem_servicoUncheckedCreateInput,
  ): Promise<sofman_status_ordem_servico> {
    const obj = await this.table.create({
      data,
    });

    return obj;
  }

  async update(
    id: number,
    data: Prisma.sofman_status_ordem_servicoUncheckedUpdateInput,
  ): Promise<sofman_status_ordem_servico> {
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
    filters: Prisma.sofman_status_ordem_servicoWhereInput = {},
    fields: string[] = [],
  ): Promise<IServiceOrderStatus['listByClient'][]> {
    const dataInit: Prisma.sofman_status_ordem_servicoWhereInput = {
      id_cliente: idClient,
    };
    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_status_ordem_servicoSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            id: true,
            id_cliente: true,
            status: true,
            requer_justificativa: true,
            notifica_solicitante: true,
            cor: true,
            cor_font: true,
            finalizacao: true,
            mostra_mantenedor: true,
            log_date: true,
          };

    filters = Object.keys(filters).length > 0 && querySetFilter(filters);

    const obj = await this.table.findMany({
      select: select,
      where: { ...dataInit, ...filters },
    });

    return obj;
  }
  async choiceServiceOrderStatus(
    idClient: number,
    typeAccess: number,
  ): Promise<IServiceOrderStatus['choiceServiceOrderStatus'][]> {
    const where: Prisma.sofman_status_ordem_servicoWhereInput = {
      id_cliente: idClient,
    };

    const select: Prisma.sofman_status_ordem_servicoSelect = {
      id: true,
      status: true,
      finalizacao: true,
      requer_justificativa: true,
      _count: {
        select: {
          serviceOrder: true,
        },
      },
    };

    if (typeAccess === 2) {
      where['mostra_mantenedor'] = 1;
    }

    const obj = await this.table.findMany({
      select: select,
      where: where,
    });

    return obj;
  }
}
