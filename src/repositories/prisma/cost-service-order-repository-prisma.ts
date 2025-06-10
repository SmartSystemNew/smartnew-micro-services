import { Injectable } from '@nestjs/common';
import { Prisma, sofman_cad_custos_ordens_servico } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { ICostServiceOrder } from 'src/models/ICostServiceOrder';
import { querySetFilter } from 'src/service/queryFilters.service';
import { querySetSelect } from 'src/service/querySelect.service';
import { CostServiceOrderRepository } from '../cost-service-order-repository';

@Injectable()
export default class CostServiceOrderRepositoryPrisma
  implements CostServiceOrderRepository
{
  private table = this.prismaService.sofman_cad_custos_ordens_servico;

  constructor(private prismaService: PrismaService) {}
  async findById(id: number): Promise<ICostServiceOrder['findById'] | null> {
    const obj = await this.table.findFirst({
      select: {
        id: true,
        id_ordem_servico: true,
        id_descricao_custo: true,
        quantidade: true,
        valor_unitario: true,
        custo: true,
        data_custo: true,
        observacoes: true,
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
    data: Prisma.sofman_cad_custos_ordens_servicoUncheckedCreateInput,
  ): Promise<sofman_cad_custos_ordens_servico> {
    const obj = await this.table.create({
      data,
      select: {
        id: true,
        id_app: true,
        id_ordem_servico: true,
        id_descricao_custo: true, // ✅ Correto
        quantidade: true,
        valor_unitario: true,
        custo: true,
        data_custo: true,
        observacoes: true,
        log_user: true,
        log_date: true,
        descriptionCostServiceOrder: {
          // 🔹 Garantindo que a relação seja carregada
          select: {
            id: true,
            descricao: true,
          },
        },
      },
    });

    return obj;
  }

  async update(
    id: number,
    data: Prisma.sofman_cad_custos_ordens_servicoUncheckedUpdateInput,
  ): Promise<sofman_cad_custos_ordens_servico> {
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
    filters: Prisma.sofman_cad_custos_ordens_servicoWhereInput = {},
    fields: string[] = [],
  ): Promise<ICostServiceOrder['listByServiceOrder'][]> {
    const where: Prisma.sofman_cad_custos_ordens_servicoWhereInput = {
      id_ordem_servico: idServiceOrder,
    };

    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_cad_custos_ordens_servicoSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            id: true,
            id_ordem_servico: true,
            id_descricao_custo: true,
            quantidade: true,
            valor_unitario: true,
            custo: true,
            data_custo: true,
            observacoes: true,
            log_user: true,
            log_date: true,
            descriptionCostServiceOrder: {
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
