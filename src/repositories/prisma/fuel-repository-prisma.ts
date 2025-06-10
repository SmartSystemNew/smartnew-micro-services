import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IFuel } from 'src/models/IFuel';
import { FuelRepository } from '../fuel-repository';
import { Prisma, sofman_combustivel } from '@prisma/client';

@Injectable()
export default class FuelRepositoryPrisma implements FuelRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_combustivel;

  async listByClient(clientId: number): Promise<IFuel['listByClient'][]> {
    const fuel = await this.table.findMany({
      select: {
        id: true,
        descricao: true,
        unidade: true,
      },
      where: {
        id_cliente: clientId,
      },
    });

    return fuel;
  }

  async findById(id: number): Promise<IFuel['findById'] | null> {
    const fuel = await this.table.findUnique({
      select: {
        id: true,
        descricao: true,
        unidade: true,
      },
      where: {
        id,
      },
    });

    return fuel;
  }

  async create(
    data: Prisma.sofman_combustivelUncheckedCreateInput,
  ): Promise<sofman_combustivel> {
    const fuel = await this.table.create({ data });

    return fuel;
  }

  async update(
    id: number,
    data: Prisma.sofman_combustivelUncheckedUpdateInput,
  ): Promise<sofman_combustivel> {
    const fuel = await this.table.update({ data, where: { id } });

    return fuel;
  }

  async delete(id: number): Promise<sofman_combustivel> {
    const fuel = await this.table.delete({ where: { id } });

    return fuel;
  }
}
