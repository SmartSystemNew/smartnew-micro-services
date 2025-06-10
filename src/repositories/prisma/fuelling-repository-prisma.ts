import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IFuelling } from 'src/models/IFuelling';
import { FuellingRepository } from '../fuelling-repository';
import { Prisma, sofman_abastecimento } from '@prisma/client';

@Injectable()
export default class FuellingRepositoryPrisma implements FuellingRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_abastecimento;

  async create(
    data: Prisma.sofman_abastecimentoUncheckedCreateInput,
  ): Promise<sofman_abastecimento> {
    try {
      const fuelling = await this.table.create({
        data,
      });

      return fuelling;
    } catch (error) {
      throw {
        stack: error.stack,
        message: error.message.includes('Error occurred')
          ? `Error occurred${error.message.split('Error occurred')[1]}`
          : error.message,
        data,
      };
    }
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id,
      },
    });

    return true;
  }

  async countListByBranchesPerPage(
    branches: number[],
    perPage: number,
    index: number,
  ): Promise<number> {
    const fuelling = await this.table.aggregate({
      _count: true,
      take: perPage,
      skip: perPage * index,
      where: {
        id_filial: {
          in: branches,
        },
      },
    });

    return fuelling._count || 0;
  }

  async countListByBranches(branches: number[]): Promise<number> {
    const fuelling = await this.table.aggregate({
      _count: true,
      where: {
        id_filial: {
          in: branches,
        },
      },
    });

    return fuelling._count || 0;
  }

  async listByBranchesPerPage(
    branches: number[],
    perPage: number,
    index: number,
  ): Promise<IFuelling['listByBranches'][]> {
    const fuelling = await this.table.findMany({
      take: perPage,
      skip: perPage * index,
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        numero_nota_fiscal: true,
        numero_requisicao: true,
        data_abastecimento: true,
        valorUN: true,
        quantidade: true,
        observacoes: true,
        tipo: true,
        contadorAtual: true,
        contadorAnterior: true,
        consumo_realizado: true,
        hodometro_anterior: true,
        hodometro_tanque: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
            consumo_previsto: true,
            tipo_consumo: true,
            typeEquipment: {
              select: {
                ID: true,
                tipo_equipamento: true,
              },
            },
            family: {
              select: {
                ID: true,
                familia: true,
              },
            },
          },
        },
        driver: {
          select: {
            login: true,
            name: true,
          },
        },
        supplier: {
          select: {
            login: true,
            name: true,
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        fuelStation: {
          select: {
            id: true,
            descricao: true,
          },
        },
        provider: {
          select: {
            ID: true,
            nome_fantasia: true,
          },
        },
        fuel: {
          select: {
            id: true,
            descricao: true,
          },
        },
        tank: {
          select: {
            id_tanque: true,
            tanque: true,
            modelo: true,
          },
        },
        tankFuelling: {
          select: {
            id: true,
            fuel: {
              select: {
                id: true,
                descricao: true,
              },
            },
            capacidade: true,
          },
        },
        train: {
          select: {
            id: true,
            tag: true,
            placa: true,
          },
        },
        trainFuelling: {
          select: {
            id: true,
            capacidade: true,
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
        id_filial: {
          in: branches,
        },
      },
    });

    return fuelling;
  }

  async listByBranches(
    branches: number[],
    perPage?: number | null,
    index?: number | null,
    filter?: Prisma.sofman_abastecimentoWhereInput | null,
  ): Promise<IFuelling['listByBranches'][]> {
    const fuelling = await this.table.findMany({
      ...(index !== null && {
        skip: index * perPage,
        take: perPage,
      }),
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        numero_nota_fiscal: true,
        numero_requisicao: true,
        data_abastecimento: true,
        valorUN: true,
        quantidade: true,
        observacoes: true,
        tipo: true,
        contadorAtual: true,
        contadorAnterior: true,
        consumo_realizado: true,
        hodometro_anterior: true,
        hodometro_tanque: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
            consumo_previsto: true,
            tipo_consumo: true,
            typeEquipment: {
              select: {
                ID: true,
                tipo_equipamento: true,
              },
            },
            family: {
              select: {
                ID: true,
                familia: true,
              },
            },
          },
        },
        driver: {
          select: {
            login: true,
            name: true,
          },
        },
        supplier: {
          select: {
            login: true,
            name: true,
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        fuelStation: {
          select: {
            id: true,
            descricao: true,
          },
        },
        provider: {
          select: {
            ID: true,
            nome_fantasia: true,
          },
        },
        fuel: {
          select: {
            id: true,
            descricao: true,
          },
        },
        tank: {
          select: {
            id_tanque: true,
            tanque: true,
            modelo: true,
          },
        },
        tankFuelling: {
          select: {
            id: true,
            fuel: {
              select: {
                id: true,
                descricao: true,
              },
            },
            capacidade: true,
          },
        },
        train: {
          select: {
            id: true,
            tag: true,
            placa: true,
          },
        },
        trainFuelling: {
          select: {
            id: true,
            capacidade: true,
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
        id_filial: {
          in: branches,
        },
        ...filter,
      },
    });

    return fuelling;
  }

  async listByEquipmentInBranches(
    branches: number[],
    date?: {
      start: Date;
      end: Date;
    } | null,
  ): Promise<IFuelling['listByEquipmentInBranches'][]> {
    const fuelling = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        numero_nota_fiscal: true,
        numero_requisicao: true,
        data_abastecimento: true,
        valorUN: true,
        quantidade: true,
        observacoes: true,
        tipo: true,
        contadorAtual: true,
        contadorAnterior: true,
        consumo_realizado: true,
        hodometro_anterior: true,
        hodometro_tanque: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
            consumo_previsto: true,
            tipo_consumo: true,
            typeEquipment: {
              select: {
                ID: true,
                tipo_equipamento: true,
              },
            },
            family: {
              select: {
                ID: true,
                familia: true,
              },
            },
          },
        },
        driver: {
          select: {
            login: true,
            name: true,
          },
        },
        supplier: {
          select: {
            login: true,
            name: true,
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        fuelStation: {
          select: {
            id: true,
            descricao: true,
          },
        },
        provider: {
          select: {
            ID: true,
            nome_fantasia: true,
          },
        },
        fuel: {
          select: {
            id: true,
            descricao: true,
          },
        },
        tank: {
          select: {
            id_tanque: true,
            tanque: true,
            modelo: true,
          },
        },
        tankFuelling: {
          select: {
            id: true,
            fuel: {
              select: {
                id: true,
                descricao: true,
              },
            },
            capacidade: true,
          },
        },
        train: {
          select: {
            id: true,
            tag: true,
            placa: true,
          },
        },
        trainFuelling: {
          select: {
            id: true,
            capacidade: true,
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
        equipment: {
          ID_filial: {
            in: branches,
          },
        },
        ...(date && {
          data_abastecimento: {
            gte: date.start,
            lte: date.end,
          },
        }),
      },
    });

    return fuelling;
  }

  async listByFilter(
    clientId: number,
    filter?: Prisma.sofman_abastecimentoWhereInput | null,
  ): Promise<IFuelling['listByFilter'][]> {
    const fuelling = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        numero_nota_fiscal: true,
        numero_requisicao: true,
        data_abastecimento: true,
        valorUN: true,
        quantidade: true,
        observacoes: true,
        tipo: true,
        contadorAtual: true,
        contadorAnterior: true,
        consumo_realizado: true,
        hodometro_anterior: true,
        hodometro_tanque: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
            consumo_previsto: true,
            tipo_consumo: true,
            typeEquipment: {
              select: {
                ID: true,
                tipo_equipamento: true,
              },
            },
            family: {
              select: {
                ID: true,
                familia: true,
              },
            },
          },
        },
        driver: {
          select: {
            login: true,
            name: true,
          },
        },
        supplier: {
          select: {
            login: true,
            name: true,
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        fuelStation: {
          select: {
            id: true,
            descricao: true,
          },
        },
        provider: {
          select: {
            ID: true,
            nome_fantasia: true,
          },
        },
        fuel: {
          select: {
            id: true,
            descricao: true,
          },
        },
        tank: {
          select: {
            id_tanque: true,
            tanque: true,
            modelo: true,
          },
        },
        tankFuelling: {
          select: {
            id: true,
            fuel: {
              select: {
                id: true,
                descricao: true,
              },
            },
            capacidade: true,
          },
        },
        train: {
          select: {
            id: true,
            tag: true,
            placa: true,
          },
        },
        trainFuelling: {
          select: {
            id: true,
            capacidade: true,
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
        branch: {
          ID_cliente: clientId,
        },
        ...filter,
      },
    });

    return fuelling;
  }

  async listByCompartmentTank(
    compartmentId: number,
  ): Promise<sofman_abastecimento[]> {
    const fuelling = await this.table.findMany({
      where: {
        id_compartimento_tanque: compartmentId,
      },
    });

    return fuelling;
  }

  async listByCompartmentTrain(
    compartmentId: number,
  ): Promise<sofman_abastecimento[]> {
    const fuelling = await this.table.findMany({
      where: {
        id_compartimento_comboio: compartmentId,
      },
    });

    return fuelling;
  }

  async listByEquipmentAndDriver(
    equipmentId: number | null,
    driver: string,
  ): Promise<IFuelling['listByEquipmentAndDriver'][]> {
    const fuelling = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        numero_nota_fiscal: true,
        numero_requisicao: true,
        data_abastecimento: true,
        valorUN: true,
        quantidade: true,
        observacoes: true,
        tipo: true,
        contadorAtual: true,
        contadorAnterior: true,
        consumo_realizado: true,
        hodometro_anterior: true,
        hodometro_tanque: true,
        driver: {
          select: {
            login: true,
            name: true,
          },
        },
        supplier: {
          select: {
            login: true,
            name: true,
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        train: {
          select: {
            id: true,
            tag: true,
            placa: true,
          },
        },
        trainFuelling: {
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
        branch: {
          select: {
            ID: true,
            filial_numero: true,
            company: {
              select: {
                ID: true,
                razao_social: true,
              },
            },
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
          },
        },
        fuelStation: {
          select: {
            id: true,
            descricao: true,
          },
        },
        provider: {
          select: {
            ID: true,
            nome_fantasia: true,
          },
        },
        fuel: {
          select: {
            id: true,
            descricao: true,
          },
        },
        tank: {
          select: {
            id_tanque: true,
            tanque: true,
            modelo: true,
          },
        },
        tankFuelling: {
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
        motorista: driver,
        ...(equipmentId &&
          equipmentId !== null && {
            id_equipamento: equipmentId,
          }),
      },
    });

    return fuelling;
  }

  async listByEquipmentAndSupplier(
    supplier: string,
  ): Promise<IFuelling['listByEquipmentAndSupplier'][]> {
    const fuelling = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        numero_nota_fiscal: true,
        numero_requisicao: true,
        data_abastecimento: true,
        valorUN: true,
        quantidade: true,
        observacoes: true,
        tipo: true,
        contadorAtual: true,
        contadorAnterior: true,
        consumo_realizado: true,
        hodometro_anterior: true,
        hodometro_tanque: true,
        driver: {
          select: {
            login: true,
            name: true,
          },
        },
        supplier: {
          select: {
            login: true,
            name: true,
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        train: {
          select: {
            id: true,
            tag: true,
            placa: true,
          },
        },
        trainFuelling: {
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
        branch: {
          select: {
            ID: true,
            filial_numero: true,
            company: {
              select: {
                ID: true,
                razao_social: true,
              },
            },
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
          },
        },
        fuelStation: {
          select: {
            id: true,
            descricao: true,
          },
        },
        provider: {
          select: {
            ID: true,
            nome_fantasia: true,
          },
        },
        fuel: {
          select: {
            id: true,
            descricao: true,
          },
        },
        tank: {
          select: {
            id_tanque: true,
            tanque: true,
            modelo: true,
          },
        },
        tankFuelling: {
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
        abastecedor: supplier,
      },
    });

    return fuelling;
  }

  async listByEquipmentAndDriverAndDate(
    equipmentId: number | null,
    driver: string,
    dateFrom: Date,
  ): Promise<IFuelling['listByEquipmentAndDriver'][]> {
    const fuelling = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        numero_nota_fiscal: true,
        numero_requisicao: true,
        data_abastecimento: true,
        valorUN: true,
        quantidade: true,
        observacoes: true,
        tipo: true,
        contadorAtual: true,
        contadorAnterior: true,
        consumo_realizado: true,
        hodometro_anterior: true,
        hodometro_tanque: true,
        driver: {
          select: {
            login: true,
            name: true,
          },
        },
        supplier: {
          select: {
            login: true,
            name: true,
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        train: {
          select: {
            id: true,
            tag: true,
            placa: true,
          },
        },
        trainFuelling: {
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
        branch: {
          select: {
            ID: true,
            filial_numero: true,
            company: {
              select: {
                ID: true,
                razao_social: true,
              },
            },
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
          },
        },
        fuelStation: {
          select: {
            id: true,
            descricao: true,
          },
        },
        provider: {
          select: {
            ID: true,
            nome_fantasia: true,
          },
        },
        fuel: {
          select: {
            id: true,
            descricao: true,
          },
        },
        tank: {
          select: {
            id_tanque: true,
            tanque: true,
            modelo: true,
          },
        },
        tankFuelling: {
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
        ...(equipmentId &&
          equipmentId !== null && {
            id_equipamento: equipmentId,
          }),
        motorista: driver,
        data_abastecimento: { gte: dateFrom },
      },
    });

    return fuelling;
  }

  async listByEquipmentAndSupplierAndDate(
    supplier: string,
    dateFrom: Date,
  ): Promise<IFuelling['listByEquipmentAndSupplier'][]> {
    const fuelling = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        numero_nota_fiscal: true,
        numero_requisicao: true,
        data_abastecimento: true,
        valorUN: true,
        quantidade: true,
        observacoes: true,
        tipo: true,
        contadorAtual: true,
        contadorAnterior: true,
        consumo_realizado: true,
        hodometro_anterior: true,
        hodometro_tanque: true,
        driver: {
          select: {
            login: true,
            name: true,
          },
        },
        supplier: {
          select: {
            login: true,
            name: true,
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        train: {
          select: {
            id: true,
            tag: true,
            placa: true,
          },
        },
        trainFuelling: {
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
        branch: {
          select: {
            ID: true,
            filial_numero: true,
            company: {
              select: {
                ID: true,
                razao_social: true,
              },
            },
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
          },
        },
        fuelStation: {
          select: {
            id: true,
            descricao: true,
          },
        },
        provider: {
          select: {
            ID: true,
            nome_fantasia: true,
          },
        },
        fuel: {
          select: {
            id: true,
            descricao: true,
          },
        },
        tank: {
          select: {
            id_tanque: true,
            tanque: true,
            modelo: true,
          },
        },
        tankFuelling: {
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
        abastecedor: supplier,
        data_abastecimento: { gte: dateFrom },
      },
    });

    return fuelling;
  }

  async findById(id: number): Promise<IFuelling['findById'] | null> {
    const fuelling = await this.table.findUnique({
      select: {
        id: true,
        numero_nota_fiscal: true,
        numero_requisicao: true,
        data_abastecimento: true,
        valorUN: true,
        quantidade: true,
        observacoes: true,
        tipo: true,
        contadorAtual: true,
        contadorAnterior: true,
        consumo_realizado: true,
        hodometro_anterior: true,
        hodometro_tanque: true,
        id_compartimento_comboio: true,
        id_compartimento_tanque: true,
        train: {
          select: {
            id: true,
            tag: true,
            placa: true,
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        driver: {
          select: {
            login: true,
            name: true,
          },
        },
        supplier: {
          select: {
            login: true,
            name: true,
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
            tipo_consumo: true,
          },
        },
        fuelStation: {
          select: {
            id: true,
            descricao: true,
          },
        },
        provider: {
          select: {
            ID: true,
            nome_fantasia: true,
          },
        },
        fuel: {
          select: {
            id: true,
            descricao: true,
          },
        },
        tank: {
          select: {
            id_tanque: true,
            tanque: true,
            modelo: true,
          },
        },
        tankFuelling: {
          select: {
            id: true,
            capacidade: true,
            fuel: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        trainFuelling: {
          select: {
            id: true,
            capacidade: true,
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

    return fuelling;
  }

  async update(
    id: number,
    data: Prisma.sofman_abastecimentoUncheckedUpdateInput,
  ): Promise<sofman_abastecimento> {
    try {
      const fuelling = await this.table.update({
        data,
        where: {
          id,
        },
      });

      return fuelling;
    } catch (error) {
      throw {
        stack: error.stack,
        message: error.message.includes('Error occurred')
          ? `Error occurred${error.message.split('Error occurred')[1]}`
          : error.message,
        data,
      };
    }
  }
}
