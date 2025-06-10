import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IFuellingTrain } from 'src/models/IFuellingTrain';
import FuellingTrainRepository from '../fuelling-train-repository';
import { Prisma, smartnewsystem_abastecimento_comboio } from '@prisma/client';

@Injectable()
export default class FuellingTrainRepositoryPrisma
  implements FuellingTrainRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_abastecimento_comboio;

  async listByBranches(
    branches: number[],
    filter?: Prisma.smartnewsystem_abastecimento_comboioWhereInput,
  ): Promise<IFuellingTrain['listByBranches'][]> {
    const train = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        tag: true,
        placa: true,
        capacidade: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        fuellingUser: {
          select: {
            id: true,
            user: {
              select: {
                login: true,
                name: true,
              },
            },
            codigo: true,
          },
        },
        trainFuel: {
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
            trainInlet: {
              select: {
                id: true,
                qtd_litros: true,
                data: true,
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
        ...filter,
      },
    });

    return train;
  }

  async findById(id: number): Promise<IFuellingTrain['findById'] | null> {
    const train = await this.table.findUnique({
      select: {
        id: true,
        capacidade: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        fuellingUser: {
          select: {
            id: true,
            user: {
              select: {
                login: true,
                name: true,
              },
            },
            codigo: true,
          },
        },
        trainFuel: {
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
            fuelling: {
              select: {
                id: true,
                data_abastecimento: true,
                hodometro_tanque: true,
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
              },
            },
            trainInlet: {
              select: {
                id: true,
                qtd_litros: true,
                data: true,
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
        tag: true,
        placa: true,
      },
      where: {
        id,
      },
    });

    return train;
  }

  async findByClientAndTag(
    clientId: number,
    tag: string,
  ): Promise<IFuellingTrain['findById'] | null> {
    const train = await this.table.findFirst({
      select: {
        id: true,
        capacidade: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        fuellingUser: {
          select: {
            id: true,
            user: {
              select: {
                login: true,
                name: true,
              },
            },
            codigo: true,
          },
        },
        trainFuel: {
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
            fuelling: {
              select: {
                id: true,
                data_abastecimento: true,
                hodometro_tanque: true,
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
              },
            },
            trainInlet: {
              select: {
                id: true,
                qtd_litros: true,
                data: true,
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
        tag: true,
        placa: true,
      },
      where: {
        tag,
        id_cliente: clientId,
      },
    });

    return train;
  }

  async listFuellingByBranches(
    branches: number[],
  ): Promise<IFuellingTrain['listFuellingByBranches'][]> {
    const train = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        tag: true,
        placa: true,
        trainFuel: {
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
            trainInlet: {
              select: {
                id: true,
                qtd_litros: true,
              },
            },
            inputProduct: {
              select: {
                id: true,
                valor: true,
                quantidade: true,
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

    return train;
  }

  async create(
    data: Prisma.smartnewsystem_abastecimento_comboioUncheckedCreateInput,
  ): Promise<smartnewsystem_abastecimento_comboio> {
    const train = await this.table.create({ data });

    return train;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_abastecimento_comboioUncheckedUpdateInput,
  ): Promise<smartnewsystem_abastecimento_comboio> {
    const train = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return train;
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
