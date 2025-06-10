import { Injectable } from '@nestjs/common';
import {
  Prisma,
  sofman_descricao_planejamento_manutencao,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import DescriptionPlanningRepository from '../description-planning-repository';
import IDescriptionPlanning from 'src/models/IDescriptionPlanning';

@Injectable()
export default class DescriptionPlanningRepositoryPrisma
  implements DescriptionPlanningRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_descricao_planejamento_manutencao;

  async listByBranches(
    branchId: number[],
    index: number | null,
    perPage: number | null,
    filter?: Prisma.sofman_descricao_planejamento_manutencaoWhereInput | null,
  ): Promise<IDescriptionPlanning['listByBranch'][]> {
    const descriptionPlanning = await this.table.findMany({
      ...(index !== null && {
        skip: index * perPage,
        take: perPage,
      }),
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        descricao: true,
        incremento: true,
        valor_padrao: true,
        processamento: true,
        family: {
          select: {
            ID: true,
            familia: true,
          },
        },
        sectorExecutor: {
          select: {
            Id: true,
            descricao: true,
          },
        },
        typeMaintenance: {
          select: {
            ID: true,
            tipo_manutencao: true,
          },
        },
        periodicity: {
          select: {
            id: true,
            descricao: true,
          },
        },
        planningEquipment: {
          select: {
            id: true,
            equipment: {
              select: {
                ID: true,
                equipamento_codigo: true,
                descricao: true,
              },
            },
          },
        },
      },
      where: {
        planningEquipment: {
          some: {
            equipment: {
              branch: {
                ID: {
                  in: branchId,
                },
              },
            },
          },
        },
        ...filter,
      },
    });

    return descriptionPlanning;
  }

  async create(
    data: Prisma.sofman_descricao_planejamento_manutencaoUncheckedCreateInput,
  ): Promise<sofman_descricao_planejamento_manutencao> {
    const descriptionPlanning = await this.table.create({ data });

    return descriptionPlanning;
  }

  async findById(id: number): Promise<IDescriptionPlanning['findById'] | null> {
    const descriptionPlanning = await this.table.findUnique({
      select: {
        id: true,
        descricao: true,
        incremento: true,
        valor_padrao: true,
        data_padrao: true,
        processamento: true,
        status_programacao: true,
        data_inicio: true,
        valor_inicial: true,
        family: {
          select: {
            ID: true,
            familia: true,
          },
        },
        sectorExecutor: {
          select: {
            Id: true,
            descricao: true,
          },
        },
        typeMaintenance: {
          select: {
            ID: true,
            tipo_manutencao: true,
          },
        },
        periodicity: {
          select: {
            id: true,
            descricao: true,
          },
        },
        planningEquipment: {
          select: {
            id: true,
            equipment: {
              select: {
                ID: true,
                equipamento_codigo: true,
                descricao: true,
              },
            },
          },
        },
        taskPlanningMaintenance: {
          orderBy: {
            seq: 'asc',
          },
          select: {
            id: true,
            periodicidade_uso: true,
            valor_base: true,
            data_base: true,
            seq: true,
            data_inicio: true,
            incremento_programacao: true,
            task: {
              select: {
                id: true,
                tarefa: true,
              },
            },
            modelChecklist: {
              select: {
                id: true,
                descricao: true,
              },
            },
            periodicity: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
      },
      where: { id },
    });

    return descriptionPlanning;
  }

  async update(
    id: number,
    data: Prisma.sofman_descricao_planejamento_manutencaoUncheckedUpdateInput,
  ): Promise<sofman_descricao_planejamento_manutencao> {
    const descriptionPlanning = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return descriptionPlanning;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }
}
