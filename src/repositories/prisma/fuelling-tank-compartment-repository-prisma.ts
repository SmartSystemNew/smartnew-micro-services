import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_abastecimento_tanque_combustivel,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import IFuellingTankCompartment from 'src/models/IFuellingTankCompartment';
import FuellingTankCompartmentRepository from '../fuelling-tank-compartment-repository';

@Injectable()
export default class FuellingTankCompartmentRepositoryPrisma
  implements FuellingTankCompartmentRepository
{
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService.smartnewsystem_abastecimento_tanque_combustivel;

  async findByTank(
    tankId: number,
  ): Promise<IFuellingTankCompartment['findByTank'][]> {
    const fuellingTank = await this.table.findMany({
      select: {
        id: true,
        capacidade: true,
        quantidade: true,
        fuel: {
          select: {
            id: true,
            descricao: true,
          },
        },
        fuelling: {
          select: {
            id: true,
            data_abastecimento: true,
            quantidade: true,
            fuel: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        inputProduct: {
          select: {
            id: true,
            valor: true,
            quantidade: true,
            input: {
              select: {
                id: true,
                data: true,
              },
            },
          },
        },
        tankInlet: {
          select: {
            id: true,
            data: true,
            qtd_litros: true,
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
        id_tanque: tankId,
      },
    });

    return fuellingTank;
  }

  async findById(
    id: number,
  ): Promise<IFuellingTankCompartment['findById'] | null> {
    const fuellingTank = await this.table.findUnique({
      select: {
        id: true,
        capacidade: true,
        quantidade: true,
        fuel: {
          select: {
            id: true,
            descricao: true,
          },
        },
        fuelling: {
          select: {
            id: true,
            data_abastecimento: true,
            quantidade: true,
            hodometro_tanque: true,
            fuel: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        inputProduct: {
          select: {
            id: true,
            valor: true,
            quantidade: true,
            input: {
              select: {
                id: true,
                data: true,
              },
            },
          },
        },
        tankInlet: {
          select: {
            id: true,
            data: true,
            qtd_litros: true,
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

    return fuellingTank;
  }

  async create(
    data: Prisma.smartnewsystem_abastecimento_tanque_combustivelUncheckedCreateInput,
  ): Promise<smartnewsystem_abastecimento_tanque_combustivel> {
    const fuellingTank = await this.table.create({
      data,
    });

    return fuellingTank;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_abastecimento_tanque_combustivelUncheckedUpdateInput,
  ): Promise<smartnewsystem_abastecimento_tanque_combustivel> {
    const fuellingTank = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return fuellingTank;
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
