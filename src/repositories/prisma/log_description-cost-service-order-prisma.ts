import { Injectable } from '@nestjs/common';
import {
  Prisma,
  log_sofman_cad_descricao_custos_ordem_servico,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { LogDescriptionCostServiceOrderRepository } from '../log_description-cost-service-order-repository';

@Injectable()
export default class LogDescriptionCostServiceOrderRepositoryPrisma
  implements LogDescriptionCostServiceOrderRepository
{
  private table =
    this.prismaService.log_sofman_cad_descricao_custos_ordem_servico;

  constructor(private prismaService: PrismaService) {}
  async findById(
    id: number,
  ): Promise<log_sofman_cad_descricao_custos_ordem_servico | null> {
    const obj = await this.table.findFirst({
      select: {
        id: true,
        id_cliente: true,
        id_descricao: true,
        descricao: true,
        unidade: true,
        observacao: true,
        log_user: true,
        acao: true,
        log_date: true,
      },
      where: {
        id: id,
      },
    });

    return obj;
  }

  async create(
    data: Prisma.log_sofman_cad_descricao_custos_ordem_servicoUncheckedCreateInput,
  ): Promise<log_sofman_cad_descricao_custos_ordem_servico> {
    const obj = await this.table.create({
      data,
    });

    return obj;
  }

  async update(
    id: number,
    data: Prisma.log_sofman_cad_descricao_custos_ordem_servicoUncheckedUpdateInput,
  ): Promise<log_sofman_cad_descricao_custos_ordem_servico> {
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
    filters?:
      | Prisma.log_sofman_cad_descricao_custos_ordem_servicoWhereInput
      | any,
    fields?: string[],
  ): Promise<log_sofman_cad_descricao_custos_ordem_servico[]> {
    if (!filters) filters = {};
    if (!fields) fields = [];

    const obj = await this.table.findMany({
      select: {
        id: true,
        id_cliente: true,
        id_descricao: true,
        descricao: true,
        unidade: true,
        observacao: true,
        log_user: true,
        acao: true,
        log_date: true,
      },
      where: {
        id_cliente: idClient,
        ...filters,
      },
    });

    return obj;
  }
}
