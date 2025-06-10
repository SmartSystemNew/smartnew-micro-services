import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import IInputFuel from 'src/models/IInputFuel';
import FuellingInputFuelRepository from '../fuelling-input-fuel-repository';
import { Prisma, smartnewsystem_abastecimento_entrada } from '@prisma/client';

@Injectable()
export default class FuellingInputFuelRepositoryPrisma
  implements FuellingInputFuelRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_abastecimento_entrada;

  async listByClient(clientId: number): Promise<IInputFuel['listByClient'][]> {
    const input = await this.table.findMany({
      orderBy: {
        data: 'desc',
      },
      select: {
        id: true,
        nota_fiscal: true,
        data: true,
        tank: {
          select: {
            id_tanque: true,
            tanque: true,
            modelo: true,
          },
        },
        train: {
          select: {
            id: true,
            placa: true,
            tag: true,
          },
        },
        provider: {
          select: {
            ID: true,
            razao_social: true,
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        inputProduct: {
          select: {
            id: true,
            fuelTank: {
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
            fuelTrain: {
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
            valor: true,
            quantidade: true,
          },
        },
      },
      where: {
        id_cliente: clientId,
      },
    });

    return input;
  }

  async findById(id: number): Promise<IInputFuel['findById'] | null> {
    const input = await this.table.findUnique({
      select: {
        id: true,
        nota_fiscal: true,
        data: true,
        tank: {
          select: {
            id_tanque: true,
            tanque: true,
            modelo: true,
          },
        },
        train: {
          select: {
            id: true,
            placa: true,
            tag: true,
          },
        },
        provider: {
          select: {
            ID: true,
            razao_social: true,
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        inputProduct: {
          select: {
            id: true,
            fuelTank: {
              select: {
                id: true,
                fuelling: {
                  take: 1,
                  orderBy: {
                    data_abastecimento: 'desc',
                  },
                  select: {
                    id: true,
                    data_abastecimento: true,
                    quantidade: true,
                  },
                },
                fuel: {
                  select: {
                    id: true,
                    descricao: true,
                  },
                },
              },
            },
            fuelTrain: {
              select: {
                id: true,
                fuelling: {
                  take: 1,
                  orderBy: {
                    data_abastecimento: 'desc',
                  },
                  select: {
                    id: true,
                    data_abastecimento: true,
                    quantidade: true,
                  },
                },
                fuel: {
                  select: {
                    id: true,
                    descricao: true,
                  },
                },
              },
            },
            valor: true,
            quantidade: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return input;
  }

  async findByClientAndFiscalAndProvider(
    clientId: number,
    fiscal: string,
    providerId: number,
  ): Promise<IInputFuel['findByClientAndFiscalAndProvider'] | null> {
    const input = await this.table.findFirst({
      select: {
        id: true,
        nota_fiscal: true,
        data: true,
        tank: {
          select: {
            id_tanque: true,
            tanque: true,
            modelo: true,
          },
        },
        train: {
          select: {
            id: true,
            placa: true,
            tag: true,
          },
        },
        provider: {
          select: {
            ID: true,
            razao_social: true,
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        inputProduct: {
          select: {
            id: true,
            fuelTank: {
              select: {
                id: true,
                fuelling: {
                  take: 1,
                  orderBy: {
                    data_abastecimento: 'desc',
                  },
                  select: {
                    id: true,
                    data_abastecimento: true,
                    quantidade: true,
                  },
                },
                fuel: {
                  select: {
                    id: true,
                    descricao: true,
                  },
                },
              },
            },
            fuelTrain: {
              select: {
                id: true,
                fuelling: {
                  take: 1,
                  orderBy: {
                    data_abastecimento: 'desc',
                  },
                  select: {
                    id: true,
                    data_abastecimento: true,
                    quantidade: true,
                  },
                },
                fuel: {
                  select: {
                    id: true,
                    descricao: true,
                  },
                },
              },
            },
            valor: true,
            quantidade: true,
          },
        },
      },
      where: {
        id_cliente: clientId,
        nota_fiscal: fiscal,
        id_fornecedor: providerId,
      },
    });

    return input;
  }

  async create(
    data: Prisma.smartnewsystem_abastecimento_entradaUncheckedCreateInput,
  ): Promise<smartnewsystem_abastecimento_entrada> {
    const input = await this.table.create({
      data,
    });

    return input;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_abastecimento_entradaUncheckedUpdateInput,
  ): Promise<smartnewsystem_abastecimento_entrada> {
    const input = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return input;
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
