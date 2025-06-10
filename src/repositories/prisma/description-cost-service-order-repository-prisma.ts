import { Injectable } from '@nestjs/common';
import {
  Prisma,
  sofman_cad_descricao_custos_ordem_servico,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { IDescriptionCostServiceOrder } from 'src/models/IDescriptionCostServiceOrder';
import { querySetFilter } from 'src/service/queryFilters.service';
import { querySetSelect } from 'src/service/querySelect.service';
import { DescriptionCostServiceOrderRepository } from '../description-cost-service-order-repository';

@Injectable()
export default class DescriptionCostServiceOrderRepositoryPrisma
  implements DescriptionCostServiceOrderRepository
{
  private table = this.prismaService.sofman_cad_descricao_custos_ordem_servico;

  constructor(private prismaService: PrismaService) {}
  async findById(
    id: number,
  ): Promise<IDescriptionCostServiceOrder['findById'] | null> {
    const obj = await this.table.findFirst({
      select: {
        id: true,
        id_cliente: true,
        descricao: true,
        unidade: true,
        observacao: true,
        log_user: true,
        log_date: true,
        costServiceOrder: {
          select: {
            id: true,
            observacoes: true,
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
    data: Prisma.sofman_cad_descricao_custos_ordem_servicoUncheckedCreateInput,
  ): Promise<sofman_cad_descricao_custos_ordem_servico> {
    const obj = await this.table.create({
      data,
    });

    return obj;
  }

  async update(
    id: number,
    data: Prisma.sofman_cad_descricao_custos_ordem_servicoUncheckedUpdateInput,
  ): Promise<sofman_cad_descricao_custos_ordem_servico> {
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
    filters: Prisma.sofman_cad_descricao_custos_ordem_servicoWhereInput = {},
    fields: string[] = [],
  ): Promise<IDescriptionCostServiceOrder['listByClient'][]> {
    const where: Prisma.sofman_cad_descricao_custos_ordem_servicoWhereInput = {
      id_cliente: idClient,
    };

    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_cad_descricao_custos_ordem_servicoSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            id: true,
            id_cliente: true,
            descricao: true,
            unidade: true,
            observacao: true,
            log_user: true,
            log_date: true,
            costServiceOrder: {
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
