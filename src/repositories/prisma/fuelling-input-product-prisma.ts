import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import IInputProduct from 'src/models/IInputProduct';
import FuellingInputProductRepository from '../fuelling-input-product-repository';
import {
  Prisma,
  smartnewsystem_abastecimento_entrada_produto,
} from '@prisma/client';

@Injectable()
export default class FuellingInputProductRepositoryPrisma
  implements FuellingInputProductRepository
{
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService.smartnewsystem_abastecimento_entrada_produto;

  async listByInput(inputId: number): Promise<IInputProduct['listByInput'][]> {
    const product = await this.table.findMany({
      select: {
        id: true,
        valor: true,
        quantidade: true,
        fuelTank: {
          select: {
            id: true,
            fuel: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        fuelTrain: {
          select: {
            id: true,
            fuel: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
      },
      where: {
        id_entrada: inputId,
      },
    });

    return product;
  }

  async findById(id: number): Promise<IInputProduct['findById'] | null> {
    const product = await this.table.findUnique({
      select: {
        id: true,
        valor: true,
        quantidade: true,
        input: {
          select: {
            id: true,
            nota_fiscal: true,
            data: true,
          },
        },
        fuelTank: {
          select: {
            id: true,
            fuelling: {
              take: 1,
              orderBy: {
                data_abastecimento: 'desc',
              },
              select: {
                id: true,
                data_abastecimento: true,
                quantidade: true,
              },
            },
            fuel: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        fuelTrain: {
          select: {
            id: true,
            fuelling: {
              take: 1,
              orderBy: {
                data_abastecimento: 'desc',
              },
              select: {
                id: true,
                data_abastecimento: true,
                quantidade: true,
              },
            },
            fuel: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });

    return product;
  }

  async create(
    data: Prisma.smartnewsystem_abastecimento_entrada_produtoUncheckedCreateInput,
  ): Promise<smartnewsystem_abastecimento_entrada_produto> {
    const product = await this.table.create({
      data,
    });

    return product;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_abastecimento_entrada_produtoUncheckedUpdateInput,
  ): Promise<smartnewsystem_abastecimento_entrada_produto> {
    const product = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return product;
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
