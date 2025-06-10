import { Injectable } from '@nestjs/common';
import { Prisma, sofman_analise_falha } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { querySetFilter } from 'src/service/queryFilters.service';
import { querySetSelect } from 'src/service/querySelect.service';

import { IFailureAnalysisServiceOrder } from 'src/models/IFailureAnalysisServiceOrder';
import { FailureAnalysisServiceOrderRepository } from '../failure-analysis-service-order-repository';

@Injectable()
export default class FailureAnalysisServiceOrderRepositoryPrisma
  implements FailureAnalysisServiceOrderRepository
{
  private table = this.prismaService.sofman_analise_falha;

  constructor(private prismaService: PrismaService) {}
  async findById(
    id: number,
  ): Promise<IFailureAnalysisServiceOrder['findById'] | null> {
    const obj = await this.table.findFirst({
      select: {
        id: true,
        id_cliente: true,
        id_filial: true,
        id_ordem_servico: true,
        id_familia: true,
        id_tipo_equipamento: true,
        id_equipamento: true,
        id_componente: true,
        id_sintoma: true,
        id_causa: true,
        id_acao: true,
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
    data: Prisma.sofman_analise_falhaUncheckedCreateInput,
  ): Promise<sofman_analise_falha> {
    const obj = await this.table.create({
      data,
    });

    return obj;
  }

  async update(
    id: number,
    data: Prisma.sofman_analise_falhaUncheckedUpdateInput,
  ): Promise<sofman_analise_falha> {
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
  async listByServiceOrder(
    idServiceOrder: number,
    filters: Prisma.sofman_analise_falhaWhereInput = {},
    fields: string[] = [],
  ): Promise<IFailureAnalysisServiceOrder['listByServiceOrder'][]> {
    const where: Prisma.sofman_analise_falhaWhereInput = {
      id_ordem_servico: idServiceOrder,
    };

    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_analise_falhaSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            id: true,
            id_cliente: true,
            id_filial: true,
            id_ordem_servico: true,
            id_familia: true,
            id_tipo_equipamento: true,
            id_equipamento: true,
            id_componente: true,
            id_sintoma: true,
            id_causa: true,
            id_acao: true,
            log_user: true,
            log_date: true,
            components: {
              select: {
                id: true,
                componente: true,
              },
            },
            failureSymptoms: {
              select: {
                id: true,
                descricao: true,
              },
            },
            failureCause: {
              select: {
                id: true,
                descricao: true,
              },
            },
            failureAction: {
              select: {
                id: true,
                descricao: true,
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
