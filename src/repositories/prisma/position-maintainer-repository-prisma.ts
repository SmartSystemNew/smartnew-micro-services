import { Injectable } from '@nestjs/common';
import { Prisma, sofman_cad_cargos_mantenedores } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import PositionMaintainerRepository from '../position-maintainer-repository';
import { IPositionMaintainer } from 'src/models/IPositionMaintainer';

@Injectable()
export class PositionMaintainerRepositoryPrisma
  implements PositionMaintainerRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_cad_cargos_mantenedores;

  async findById(id: number): Promise<IPositionMaintainer['findById']> {
    const position = await this.table.findFirst({
      select: {
        id: true,
        id_cliente: true,
        descricao: true,
        log_date: true,
      },
      where: {
        id,
      },
    });

    return position;
  }

  async list(
    clientId: number,
    filters?: Prisma.sofman_cad_cargos_mantenedoresWhereInput | null,
  ): Promise<IPositionMaintainer['list']> {
    const positions = await this.table.findMany({
      select: {
        id: true,
        id_cliente: true,
        descricao: true,
        log_date: true,
      },
      where: {
        id_cliente: clientId,
        ...filters,
      },
    });

    return positions;
  }

  async create(
    data: Prisma.sofman_cad_cargos_mantenedoresUncheckedCreateInput,
  ): Promise<sofman_cad_cargos_mantenedores> {
    const position = await this.table.create({
      data,
    });

    return position;
  }

  async update(
    id: number,
    data: Prisma.sofman_cad_cargos_mantenedoresUncheckedUpdateInput,
  ): Promise<sofman_cad_cargos_mantenedores> {
    const position = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return position;
  }

  async delete(id: number): Promise<boolean> {
    const position = await this.table.delete({
      where: {
        id,
      },
    });

    return !!position;
  }
}
