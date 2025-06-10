import { Injectable } from '@nestjs/common';
import { Prisma, sofman_cad_prioridades_ordem_servico } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import PriorityServiceOrderRepository from '../priority-service-order-repository';

@Injectable()
export default class PriorityServiceOrderRepositoryPrisma
  implements PriorityServiceOrderRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_cad_prioridades_ordem_servico;

  async listByClient(
    clientId: number,
    filter?: Prisma.sofman_cad_prioridades_ordem_servicoWhereInput | null,
  ): Promise<sofman_cad_prioridades_ordem_servico[]> {
    const priority = await this.table.findMany({
      select: {
        id: true,
        id_cliente: true,
        descricao: true,
        prazo_atendimento: true,
        cor: true,
        log_date: true,
      },
      where: {
        id_cliente: clientId,
        ...filter,
      },
    });

    return priority;
  }

  async findById(
    id: number,
  ): Promise<sofman_cad_prioridades_ordem_servico | null> {
    const priority = await this.table.findFirst({
      where: {
        id,
      },
    });

    return priority;
  }

  async create(
    data: Prisma.sofman_cad_prioridades_ordem_servicoUncheckedCreateInput,
  ): Promise<sofman_cad_prioridades_ordem_servico> {
    const priority = await this.table.create({
      data,
    });

    return priority;
  }

  async update(
    id: number,
    data: Prisma.sofman_cad_prioridades_ordem_servicoUncheckedUpdateInput,
  ) {
    const priority = await this.table.update({
      data,
      where: {
        id: id,
      },
    });

    return priority;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id: id,
      },
    });

    return true;
  }
}
