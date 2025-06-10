import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IFuelStation } from 'src/models/IFuelStation';
import { FuelStationRepository } from '../fuel-station-repository';
import { Prisma, sofman_posto_combustivel } from '@prisma/client';

@Injectable()
export default class FuelStationRepositoryPrisma
  implements FuelStationRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_posto_combustivel;

  async findByClient(
    clientId: number,
  ): Promise<IFuelStation['findByClient'][]> {
    const station = await this.table.findMany({
      select: {
        id: true,
        descricao: true,
      },
      where: {
        id_cliente: clientId,
      },
    });

    return station;
  }

  async findById(id: number): Promise<IFuelStation['findById'] | null> {
    const station = await this.table.findUnique({
      select: {
        id: true,
        descricao: true,
      },
      where: {
        id,
      },
    });

    return station;
  }

  async create(
    data: Prisma.sofman_posto_combustivelUncheckedCreateInput,
  ): Promise<sofman_posto_combustivel> {
    const station = await this.table.create({
      data,
    });

    return station;
  }
}
