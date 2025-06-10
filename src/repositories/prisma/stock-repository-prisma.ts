import { Injectable } from '@nestjs/common';
import { Prisma, sofman_entrada_estoque } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import StockRepository from '../stock-repository';

@Injectable()
export default class StockRepositoryPrisma implements StockRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_entrada_estoque;

  async findByRequest(
    requestId: number,
  ): Promise<sofman_entrada_estoque | null> {
    const entry = await this.table.findFirst({
      where: {
        id_pedido: requestId,
      },
    });

    return entry;
  }

  async findByClientAndBranchAndProviderAndNumber(
    clientId: number,
    branchId: number,
    providerId: number,
    number: string,
  ): Promise<sofman_entrada_estoque | null> {
    const entry = await this.table.findFirst({
      where: {
        id_cliente: clientId,
        id_filial: branchId,
        id_fornecedor: providerId,
        numero_documento: number,
      },
    });

    return entry;
  }

  async create(
    data: Prisma.sofman_entrada_estoqueUncheckedCreateInput,
  ): Promise<sofman_entrada_estoque> {
    const entry = await this.table.create({ data });
    return entry;
  }

  async update(
    id: number,
    data: Prisma.sofman_entrada_estoqueUncheckedUpdateInput,
  ): Promise<sofman_entrada_estoque> {
    const entry = await this.table.update({
      data,
      where: {
        id: id,
      },
    });
    return entry;
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
