import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IFuellingControlUser } from 'src/models/IFuellingControlUser';
import { FuellingControlUserRepository } from '../fuelling-control-user-repository';
import {
  Prisma,
  smartnewsystem_abastecimento_controle_usuario,
} from '@prisma/client';

@Injectable()
export default class FuellingControlUserRepositoryPrisma
  implements FuellingControlUserRepository
{
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService.smartnewsystem_abastecimento_controle_usuario;

  async listByClient(
    clientId: number,
  ): Promise<IFuellingControlUser['listByClient'][]> {
    const control = await this.table.findMany({
      select: {
        id: true,
        motorista: true,
        abastecedor: true,
        codigo: true,
        user: {
          select: {
            name: true,
            login: true,
          },
        },
        train: {
          select: {
            id: true,
            placa: true,
            tag: true,
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
      },
      where: {
        id_cliente: clientId,
      },
    });

    return control;
  }

  async listByBranches(
    branchId: number[],
  ): Promise<IFuellingControlUser['listByBranches'][]> {
    const control = await this.table.findMany({
      select: {
        id: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        motorista: true,
        abastecedor: true,
        user: {
          select: {
            name: true,
            login: true,
          },
        },
        codigo: true,
      },
      where: {
        id_filial: {
          in: branchId,
        },
      },
    });

    return control;
  }

  async findById(id: number): Promise<IFuellingControlUser['findById'] | null> {
    const control = await this.table.findFirst({
      select: {
        id: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        motorista: true,
        abastecedor: true,
        user: {
          select: {
            name: true,
            login: true,
          },
        },
        codigo: true,
      },
      where: {
        id,
      },
    });

    return control;
  }
  async findByLogin(
    login: string,
  ): Promise<IFuellingControlUser['findByLogin'] | null> {
    const control = await this.table.findFirst({
      select: {
        id: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        motorista: true,
        abastecedor: true,
        train: {
          select: {
            id: true,
            placa: true,
            tag: true,
          },
        },
        user: {
          select: {
            name: true,
            login: true,
          },
        },
        codigo: true,
      },
      where: {
        usuario: login,
      },
    });

    return control;
  }

  async listDriverByBranch(
    branchId: number,
  ): Promise<IFuellingControlUser['listDriverByBranch'][]> {
    const control = await this.table.findMany({
      select: {
        user: {
          select: {
            login: true,
            name: true,
          },
        },
      },
      where: {
        id_filial: branchId,
        motorista: 1,
      },
    });

    return control;
  }

  async listSupplierByBranch(
    branchId: number,
  ): Promise<IFuellingControlUser['listSupplierByBranch'][]> {
    const control = await this.table.findMany({
      select: {
        user: {
          select: {
            login: true,
            name: true,
          },
        },
      },
      where: {
        id_filial: branchId,
        abastecedor: 1,
      },
    });

    return control;
  }

  async create(
    data: Prisma.smartnewsystem_abastecimento_controle_usuarioUncheckedCreateInput,
  ): Promise<smartnewsystem_abastecimento_controle_usuario> {
    const control = await this.table.create({ data });

    return control;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_abastecimento_controle_usuarioUncheckedUpdateInput,
  ): Promise<smartnewsystem_abastecimento_controle_usuario> {
    const control = await this.table.update({ data, where: { id } });

    return control;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }
}
