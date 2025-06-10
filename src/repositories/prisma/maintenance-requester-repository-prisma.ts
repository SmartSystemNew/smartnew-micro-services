import { Injectable } from '@nestjs/common';
import { Prisma, sofman_cad_solicitantes } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import IMaintenanceRequester from 'src/models/IMaintenanceRequester';
import MaintenanceRequesterRepository from '../maintenance-requester-repository';

@Injectable()
export default class MaintenanceRequesterRepositoryPrisma
  implements MaintenanceRequesterRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_cad_solicitantes;

  async findById(
    id: number,
  ): Promise<IMaintenanceRequester['findById'] | null> {
    const requester = await this.table.findUnique({
      select: {
        id: true,
        nome: true,
        email: true,
        observacoes: true,
        status: true,
        notificacao: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return requester;
  }

  async listByClient(
    idClient: number,
    filter?: Prisma.sofman_cad_solicitantesWhereInput | null,
  ): Promise<IMaintenanceRequester['listByClient'][]> {
    const requester = await this.table.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        observacoes: true,
        status: true,
        notificacao: true,
        log_date: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
      },
      where: {
        id_cliente: idClient,
        ...filter,
      },
    });

    return requester;
  }

  async listByBranch(
    branches: number[],
  ): Promise<IMaintenanceRequester['listByBranches'][]> {
    const requester = await this.table.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        observacoes: true,
        status: true,
        notificacao: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
      },
      where: {
        id_filial: {
          in: branches,
        },
      },
    });

    return requester;
  }

  async create(
    data: Prisma.sofman_cad_solicitantesUncheckedCreateInput,
  ): Promise<sofman_cad_solicitantes> {
    const requester = await this.table.create({ data });

    return requester;
  }

  async update(
    id: number,
    data: Prisma.sofman_cad_solicitantesUncheckedUpdateInput,
  ): Promise<sofman_cad_solicitantes> {
    const requester = await this.table.update({
      data,
      where: {
        id: id,
      },
    });

    return requester;
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
