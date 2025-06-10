import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import ILogDescriptionMaintenancePlanning from 'src/models/ILogDescriptionMaintenancePlanning';
import LogDescriptionMaintenancePlanningRepository from '../log-description-maintenance-planning-repository';

@Injectable()
export default class LogDescriptionMaintenancePlanningRepositoryPrisma
  implements LogDescriptionMaintenancePlanningRepository
{
  private table =
    this.prismaService.log_sofman_descricao_planejamento_manutencao;
  constructor(private prismaService: PrismaService) {}

  async listByWhere(
    clientId: number,
    branches: number[],
    filter?: Prisma.log_sofman_descricao_planejamento_manutencaoWhereInput,
  ): Promise<ILogDescriptionMaintenancePlanning['listByWhere'][]> {
    const description = await this.table.findMany({
      select: {
        id: true,
        acao: true,
        descriptionPlanning: {
          select: {
            id: true,
            descricao: true,
            taskPlanningMaintenance: {
              select: {
                id: true,
                task: {
                  select: {
                    id: true,
                    tarefa: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id_cliente: clientId,
        id_filial: {
          in: branches,
        },
        ...filter,
      },
    });

    return description;
  }
}
