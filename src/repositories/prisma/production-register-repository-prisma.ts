import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IProductionRegisterListByClient } from 'src/models/IProductionRegister';
import { ProductionRegisterRepository } from '../production-register-repository';

@Injectable()
export class ProductionRegisterRepositoryPrisma
  implements ProductionRegisterRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_registro_producao;

  async listByClient(
    clientId: number,
    index: number,
    perPage: number,
    filterText: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<IProductionRegisterListByClient[]> {
    const productionRegister = await this.table.findMany({
      skip: Number(index) * Number(perPage),
      take: Number(perPage),
      select: {
        id: true,
        data_hora_inicio: true,
        data_hora_encerramento: true,
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
          },
        },
        status: true,
        period: {
          select: {
            turno: true,
          },
        },
        user: {
          select: {
            name: true,
            login: true,
          },
        },
      },
      where: {
        AND: [
          {
            equipment: {
              ID_cliente: clientId,
            },
          },
          {
            OR: [
              {
                equipment: {
                  OR: [
                    {
                      descricao: {
                        contains: filterText,
                      },
                    },
                    {
                      equipamento_codigo: {
                        contains: filterText,
                      },
                    },
                  ],
                },
              },
              {
                user: {
                  OR: [
                    {
                      name: {
                        contains: filterText,
                      },
                    },
                    {
                      login: {
                        contains: filterText,
                      },
                    },
                  ],
                },
              },
              {
                period: {
                  turno: {
                    contains: filterText,
                  },
                },
              },
              {
                id: {
                  equals: Number(filterText) || -1,
                },
              },
            ],
          },
          {
            AND: [
              {
                OR: [
                  {
                    data_hora_encerramento: {
                      lte: dateTo ? new Date(dateTo) : new Date(),
                    },
                  },
                  {
                    data_hora_encerramento: {
                      equals: null,
                    },
                  },
                ],
              },
              {
                data_hora_inicio: {
                  gte: dateFrom ? new Date(dateFrom) : new Date('1970-01-01'),
                  lte: dateTo ? new Date(dateTo) : new Date(),
                },
              },
            ],
          },
        ],
      },
      orderBy: {
        id: 'desc',
      },
    });

    return productionRegister;
  }

  async listAllByClient(
    clientId: number,
    filterText: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<IProductionRegisterListByClient[]> {
    const productionRegister = await this.table.findMany({
      select: {
        id: true,
        data_hora_inicio: true,
        data_hora_encerramento: true,
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
          },
        },
        status: true,
        period: {
          select: {
            turno: true,
          },
        },
        user: {
          select: {
            name: true,
            login: true,
          },
        },
      },
      where: {
        AND: [
          {
            equipment: {
              ID_cliente: clientId,
            },
          },
          {
            OR: [
              {
                equipment: {
                  OR: [
                    {
                      descricao: {
                        contains: filterText,
                      },
                    },
                    {
                      equipamento_codigo: {
                        contains: filterText,
                      },
                    },
                  ],
                },
              },
              {
                user: {
                  OR: [
                    {
                      name: {
                        contains: filterText,
                      },
                    },
                    {
                      login: {
                        contains: filterText,
                      },
                    },
                  ],
                },
              },
              {
                period: {
                  turno: {
                    contains: filterText,
                  },
                },
              },
              {
                id: {
                  equals: Number(filterText) || -1,
                },
              },
            ],
          },
          {
            AND: [
              {
                OR: [
                  {
                    data_hora_encerramento: {
                      lte: dateTo ? new Date(dateTo) : new Date(),
                    },
                  },
                  {
                    data_hora_encerramento: {
                      equals: null,
                    },
                  },
                ],
              },
              {
                data_hora_inicio: {
                  gte: dateFrom ? new Date(dateFrom) : new Date('1970-01-01'),
                  lte: dateTo ? new Date(dateTo) : new Date(),
                },
              },
            ],
          },
        ],
      },
      orderBy: {
        id: 'desc',
      },
    });

    return productionRegister;
  }

  async countListByClient(
    clientId: number,
    filterText: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<number> {
    const count = await this.table.count({
      where: {
        AND: [
          {
            equipment: {
              ID_cliente: clientId,
            },
          },
          {
            OR: [
              {
                equipment: {
                  OR: [
                    {
                      descricao: {
                        contains: filterText,
                      },
                    },
                    {
                      equipamento_codigo: {
                        contains: filterText,
                      },
                    },
                  ],
                },
              },
              {
                user: {
                  OR: [
                    {
                      name: {
                        contains: filterText,
                      },
                    },
                    {
                      login: {
                        contains: filterText,
                      },
                    },
                  ],
                },
              },
              {
                period: {
                  turno: {
                    contains: filterText,
                  },
                },
              },
              {
                id: {
                  equals: Number(filterText) || -1,
                },
              },
            ],
          },
          {
            AND: [
              {
                OR: [
                  {
                    data_hora_encerramento: {
                      lte: dateTo ? new Date(dateTo) : new Date(),
                    },
                  },
                  {
                    data_hora_encerramento: {
                      equals: null,
                    },
                  },
                ],
              },
              {
                data_hora_inicio: {
                  gte: dateFrom ? new Date(dateFrom) : new Date('1970-01-01'),
                  lte: dateTo ? new Date(dateTo) : new Date(),
                },
              },
            ],
          },
        ],
      },
    });

    return count;
  }

  async findById(id: number): Promise<IProductionRegisterListByClient | null> {
    const productionRegister = await this.table.findUnique({
      select: {
        id: true,
        data_hora_inicio: true,
        data_hora_encerramento: true,
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
          },
        },
        status: true,
        period: {
          select: {
            turno: true,
          },
        },
        user: {
          select: {
            name: true,
            login: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return productionRegister;
  }
}
