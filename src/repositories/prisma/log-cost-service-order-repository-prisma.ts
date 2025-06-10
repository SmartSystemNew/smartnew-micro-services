import { Injectable } from '@nestjs/common';
import { log_sofman_cad_custos_ordem_servico, Prisma } from '@prisma/client';
import { filter } from 'rxjs';
import { PrismaService } from 'src/database/prisma.service';
import LogCostServiceOrderRepository from '../log-cost-service-order-repository';

@Injectable()
export default class LogCostServiceOrderRepositoryPrisma
  implements LogCostServiceOrderRepository
{
  private table = this.prismaService.log_sofman_cad_custos_ordem_servico;
  constructor(private prismaService: PrismaService) {}

  async listByServiceOrderGroupByCost(
    id_ordem_servico: number[],
  ): Promise<log_sofman_cad_custos_ordem_servico[]> {
    const obj =
      await this.prismaService.log_sofman_cad_custos_ordem_servico.findMany({
        select: {
          id: true,
          id_app: true,
          id_ordem_servico: true,
          id_descricao_custo: true,
          id_custo: true,
          quantidade: true,
          valor_unitario: true,
          custo: true,
          data_custo: true,
          observacoes: true,
          log_user: true,
          log_date: true,
          acao: true,
        },
        where: {
          id_ordem_servico: {
            in: id_ordem_servico,
          },
          ...filter,
        },
      });
    return obj;
  }

  async listByBranches(
    branches: number[],
    filter?: Prisma.log_sofman_cad_custos_ordem_servicoWhereInput | null,
  ): Promise<log_sofman_cad_custos_ordem_servico[]> {
    const obj =
      await this.prismaService.log_sofman_cad_custos_ordem_servico.findMany({
        select: {
          id: true,
          id_app: true,
          id_ordem_servico: true,
          id_descricao_custo: true,
          id_custo: true,
          quantidade: true,
          valor_unitario: true,
          custo: true,
          data_custo: true,
          observacoes: true,
          log_user: true,
          log_date: true,
          acao: true,
        },
        where: {
          costOrderService: {
            serviceOrder: {
              branch: {
                ID: {
                  in: branches,
                },
              },
            },
          },
          ...filter,
        },
      });
    return obj;
  }

  async createServiceOrderCost(
    data: Prisma.log_sofman_cad_custos_ordem_servicoUncheckedCreateInput,
  ): Promise<log_sofman_cad_custos_ordem_servico> {
    const obj =
      await this.prismaService.log_sofman_cad_custos_ordem_servico.create({
        data,
      });

    return obj;
  }

  async updateServiceOrderCost(
    id: number,
    data: Prisma.log_sofman_cad_custos_ordem_servicoUncheckedUpdateInput,
  ): Promise<log_sofman_cad_custos_ordem_servico> {
    const obj =
      await this.prismaService.log_sofman_cad_custos_ordem_servico.update({
        data,
        where: {
          id: id,
        },
      });

    return obj;
  }

  async deleteServiceOrderCost(id: number): Promise<boolean> {
    await this.prismaService.log_sofman_cad_custos_ordem_servico.delete({
      where: {
        id: id,
      },
    });

    return true;
  }
}
