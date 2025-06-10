import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  Prisma,
  smartnewsystem_abastecimento_comboio_combustivel,
} from '@prisma/client';
import IFuellingTrainCompartment from 'src/models/IFuellingTrainCompartment';
import FuellingTrainCompartmentRepository from '../fuelling-train-compartment-repository';

@Injectable()
export default class FuellingTrainCompartmentRepositoryPrisma
  implements FuellingTrainCompartmentRepository
{
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService.smartnewsystem_abastecimento_comboio_combustivel;

  async findById(
    id: number,
  ): Promise<IFuellingTrainCompartment['findById'] | null> {
    const compartment = await this.table.findUnique({
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
          },
        },
        trainInlet: {
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

    return compartment;
  }

  async create(
    data: Prisma.smartnewsystem_abastecimento_comboio_combustivelUncheckedCreateInput,
  ): Promise<smartnewsystem_abastecimento_comboio_combustivel> {
    const compartment = await this.table.create({ data });

    return compartment;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_abastecimento_comboio_combustivelUncheckedUpdateInput,
  ): Promise<smartnewsystem_abastecimento_comboio_combustivel> {
    const compartment = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return compartment;
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
