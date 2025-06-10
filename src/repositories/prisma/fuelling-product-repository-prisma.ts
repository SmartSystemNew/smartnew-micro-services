import { Injectable } from '@nestjs/common';
import { Prisma, sofman_combustivel } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import IFuellingProduct from 'src/models/IFuellingProduct';
import FuellingProductRepository from '../fuelling-product-repository';

@Injectable()
export default class FuellingProductRepositoryPrisma
  implements FuellingProductRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_combustivel;

  async findById(id: number): Promise<IFuellingProduct['findById'] | null> {
    const product = await this.table.findFirst({
      select: {
        id: true,
        descricao: true,
        unidade: true,
        fuelling: {
          select: {
            id: true,
            data_abastecimento: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return product;
  }

  async findByClientAndName(
    clientId: number,
    description: string,
  ): Promise<IFuellingProduct['findByClientAndName'] | null> {
    const product = await this.table.findFirst({
      select: {
        id: true,
        descricao: true,
        unidade: true,
      },
      where: {
        id_cliente: clientId,
        descricao: description,
      },
    });

    return product;
  }

  async listByClient(
    clientId: number,
    where?: Prisma.sofman_combustivelWhereInput | null,
  ): Promise<IFuellingProduct['listByClient'][]> {
    const product = await this.table.findMany({
      select: {
        id: true,
        descricao: true,
        unidade: true,
      },
      where: {
        id_cliente: clientId,
        ...where,
      },
    });

    return product;
  }

  async create(
    data: Prisma.sofman_combustivelUncheckedCreateInput,
  ): Promise<sofman_combustivel> {
    const product = await this.table.create({ data });

    return product;
  }

  async update(
    id: number,
    data: Prisma.sofman_combustivelUncheckedUpdateInput,
  ): Promise<sofman_combustivel> {
    const product = await this.table.update({
      data,
      where: {
        id: id,
      },
    });

    return product;
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
