import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import ILogDescriptionPlans from 'src/models/ILogDescriptionPlans';
import LogDescriptionPlanRepository from '../log_description-plan-repository';
@Injectable()
export default class LogDescriptionPlanRepositoryPrisma
  implements LogDescriptionPlanRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.log_sofman_descricao_planos_prev;

  async listByDescriptionPlans(
    clientId: number,
    filter?: Prisma.log_sofman_descricao_planos_prevWhereInput,
  ): Promise<ILogDescriptionPlans['listByDescriptionPlans'][]> {
    const description = await this.table.findMany({
      select: {
        id: true,
        id_cliente: true,
        id_subgrupo: true,
        id_familia: true,
        filiais: true,
        id_descricao_planos: true,
        id_app: true,
        descricao: true,
        acao: true,
        logo: true,
        log_date: true,
        log_user: true,
        descriptionPlans: {
          select: {
            plans: {
              select: {
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
        ...filter,
      },
    });

    return description;
  }
}
