import { Injectable } from '@nestjs/common';
import { Prisma, sofman_classificacao_ordem_servico } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import ClassificationServiceOrderRepository from '../classification-service-order-repository';

@Injectable()
export default class ClassificationServiceOrderRepositoryPrisma
  implements ClassificationServiceOrderRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_classificacao_ordem_servico;

  async listByClassification(
    clientId: number,
  ): Promise<sofman_classificacao_ordem_servico[]> {
    const classification = await this.table.findMany({
      where: {
        id_cliente: clientId,
      },
    });

    return classification;
  }

  async listByClient(
    clientId: number,
    filter?: Prisma.sofman_classificacao_ordem_servicoWhereInput | null,
  ): Promise<sofman_classificacao_ordem_servico[]> {
    const classification = await this.table.findMany({
      select: {
        id: true,
        id_cliente: true,
        descricao: true,
        log_date: true,
      },
      where: {
        id_cliente: clientId,
        ...filter,
      },
    });

    return classification;
  }

  async findById(
    id: number,
  ): Promise<sofman_classificacao_ordem_servico | null> {
    const classification = await this.table.findFirst({
      where: {
        id,
      },
    });

    return classification;
  }

  async create(
    data: Prisma.sofman_classificacao_ordem_servicoCreateInput,
  ): Promise<sofman_classificacao_ordem_servico> {
    const classification = await this.table.create({
      data,
    });

    return classification;
  }

  async update(
    id: number,
    data: Prisma.sofman_classificacao_ordem_servicoUpdateInput,
  ): Promise<sofman_classificacao_ordem_servico> {
    const classification = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return classification;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
