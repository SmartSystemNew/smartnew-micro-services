import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ITank } from 'src/models/ITank';
import { TankRepository } from '../tank-repository';
import { Prisma, cadastro_tanque } from '@prisma/client';

@Injectable()
export default class TankRepositoryPrisma implements TankRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.cadastro_tanque;

  async findById(id: number): Promise<ITank['findById'] | null> {
    const tank = await this.table.findFirst({
      select: {
        id_tanque: true,
        tanque: true,
        modelo: true,
        capacidade: true,
        estoque: true,
        hodometro: true,
        combustivel_atual: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        fuelling: {
          select: {
            id: true,
            data_abastecimento: true,
            quantidade: true,
            hodometro_tanque: true,
          },
        },
        fuellingTankFuel: {
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
        },
      },
      where: {
        id_tanque: id,
      },
    });

    return tank;
  }

  async findByClientAndModel(
    clientId: number,
    model: string,
  ): Promise<ITank['findByClientAndModel'] | null> {
    const tank = await this.table.findFirst({
      select: {
        id_tanque: true,
        tanque: true,
        modelo: true,
        capacidade: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        fuelling: {
          select: {
            id: true,
            data_abastecimento: true,
            hodometro_tanque: true,
            quantidade: true,
          },
        },
      },
      where: {
        ID_cliente: clientId,
        modelo: model,
      },
    });

    return tank;
  }

  async listByClientAndBranches(
    clientId: number,
    branches: number[],
    filter?: Prisma.cadastro_tanqueWhereInput,
  ): Promise<ITank['listByClientAndBranches'][]> {
    const tank = await this.table.findMany({
      select: {
        id_tanque: true,
        tanque: true,
        modelo: true,
        estoque: true,
        hodometro: true,
        combustivel_atual: true,
        capacidade: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        fuelling: {
          select: {
            id: true,
            hodometro_tanque: true,
            quantidade: true,
            data_abastecimento: true,
          },
        },
        fuellingTankFuel: {
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
        },
      },
      where: {
        ID_cliente: clientId,
        id_filial: {
          in: branches,
        },
        ...filter,
      },
    });

    return tank;
  }

  async listFuellingByBranches(
    branches: number[],
  ): Promise<ITank['listFuellingByBranches'][]> {
    const tank = await this.table.findMany({
      select: {
        id_tanque: true,
        tanque: true,
        modelo: true,
        estoque: true,
        hodometro: true,
        combustivel_atual: true,
        capacidade: true,
        fuellingTankFuel: {
          select: {
            id: true,
            fuel: {
              select: {
                id: true,
                descricao: true,
              },
            },
            capacidade: true,
            quantidade: true,
            tankInlet: {
              select: {
                id: true,
                data: true,
                qtd_litros: true,
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
            fuelling: {
              select: {
                id: true,
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
          },
        },
      },
      where: {
        id_filial: {
          in: branches,
        },
      },
    });

    return tank;
  }

  async create(
    data: Prisma.cadastro_tanqueUncheckedCreateInput,
  ): Promise<cadastro_tanque> {
    const tank = await this.table.create({
      data,
    });

    return tank;
  }

  async update(
    id: number,
    data: Prisma.cadastro_tanqueUncheckedUpdateInput,
  ): Promise<cadastro_tanque> {
    const tank = await this.table.update({
      data,
      where: {
        id_tanque: id,
      },
    });

    return tank;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id_tanque: id,
      },
    });

    return true;
  }
}
