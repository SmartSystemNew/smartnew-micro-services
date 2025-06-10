import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import IFuellingControl from 'src/models/IFuellingControl';
import FuellingControlRepository from '../fuelling-control-repository';
import { Prisma, smartnewsystem_abastecimento_controle } from '@prisma/client';

@Injectable()
export default class FuellingControlRepositoryPrisma
  implements FuellingControlRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_abastecimento_controle;

  async listByClient(
    clientId: number,
  ): Promise<IFuellingControl['listByClient'] | null> {
    const control = await this.table.findFirst({
      select: {
        id: true,
        filtro_dia: true,
        modelo_PU: true,
        inicio_controle: true,
        company: {
          select: {
            ID: true,
            razao_social: true,
          },
        },
      },
      where: {
        id_cliente: clientId,
      },
    });

    return control;
  }

  async findById(id: number): Promise<IFuellingControl['listByClient'] | null> {
    const control = await this.table.findFirst({
      select: {
        id: true,
        filtro_dia: true,
        modelo_PU: true,
        inicio_controle: true,
        company: {
          select: {
            ID: true,
            razao_social: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return control;
  }

  async create(
    data: Prisma.smartnewsystem_abastecimento_controleUncheckedCreateInput,
  ): Promise<smartnewsystem_abastecimento_controle> {
    const control = await this.table.create({ data });

    return control;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_abastecimento_controleUncheckedUpdateInput,
  ): Promise<smartnewsystem_abastecimento_controle> {
    const control = await this.table.update({
      where: { id },
      data,
    });

    return control;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }
}
