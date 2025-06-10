import { Injectable } from '@nestjs/common';
import { sofman_cad_planos_prev } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import PreventivePlanRepository from '../preventive-plan-repository';

@Injectable()
export default class PreventivePlanRepositoryPrisma
  implements PreventivePlanRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_cad_planos_prev;

  async listByPlan(planId: number): Promise<sofman_cad_planos_prev[]> {
    const preventivePlan = await this.table.findMany({
      where: {
        id_plano_prev: planId,
      },
    });

    return preventivePlan;
  }
}
