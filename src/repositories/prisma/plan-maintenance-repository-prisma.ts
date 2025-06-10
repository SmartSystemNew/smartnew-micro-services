import { Injectable } from '@nestjs/common';
import { Prisma, sofman_cad_planos_prev } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { IPlanMaintenance } from 'src/models/IPlanMaintenance';
import { querySetFilter } from 'src/service/queryFilters.service';
import { querySetSelect } from 'src/service/querySelect.service';
import { PlanMaintenanceRepository } from '../plan-maintenance-repository';

@Injectable()
export default class PlanMaintenanceRepositoryPrisma
  implements PlanMaintenanceRepository
{
  private table = this.prismaService.sofman_cad_planos_prev;

  constructor(private prismaService: PrismaService) {}
  async findById(id: number): Promise<IPlanMaintenance['findById'] | null> {
    const obj = await this.table.findFirst({
      select: {
        ID: true,
        id_plano_prev: true,
        seq: true,
        id_setor_executante: true,
        id_componente: true,
        tarefa: true,
        unidade_dia: true,
        periodicidade_dias: true,
        obrigatorio: true,
        Tempo_hh: true,
        requer_imagem: true,
        log_date: true,
        log_user: true,
      },
      where: {
        ID: id,
      },
    });

    return obj;
  }

  async create(
    data: Prisma.sofman_cad_planos_prevUncheckedCreateInput,
  ): Promise<sofman_cad_planos_prev> {
    const obj = await this.table.create({
      data,
    });

    return obj;
  }

  async update(
    id: number,
    data: Prisma.sofman_cad_planos_prevUncheckedUpdateInput,
  ): Promise<sofman_cad_planos_prev> {
    const obj = await this.table.update({
      data,
      where: {
        ID: id,
      },
    });

    return obj;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        ID: id,
      },
    });

    return true;
  }

  async listByPlanDescription(
    planDescription: number,
    filters: Prisma.sofman_cad_planos_prevWhereInput = {},
    fields: string[] = [],
  ): Promise<IPlanMaintenance['listByPlanDescription'][]> {
    const where: Prisma.sofman_cad_planos_prevWhereInput = {
      id_plano_prev: planDescription,
    };

    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_cad_planos_prevSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            ID: true,
            id_plano_prev: true,
            seq: true,
            id_setor_executante: true,
            id_componente: true,
            unidade_dia: true,
            periodicidade_dias: true,
            obrigatorio: true,
            Tempo_hh: true,
            requer_imagem: true,
            log_date: true,
            log_user: true,
          };

    filters = Object.keys(filters).length > 0 && querySetFilter(filters);

    const obj = await this.table.findMany({
      select: select,
      where: { ...where, ...filters },
    });
    return obj;
  }
}
