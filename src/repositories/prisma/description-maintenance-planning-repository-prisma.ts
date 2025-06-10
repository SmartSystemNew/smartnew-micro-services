import { Injectable } from '@nestjs/common';
import {
  Prisma,
  sofman_descricao_planejamento_manutencao,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import DescriptionMaintenancePlanningRepository from '../description-maintenance-planning-repository';
import { IDescriptionMaintenancePlanning } from 'src/models/IDescriptionMaintenancePlanning';

@Injectable()
export default class DescriptionMaintenancePlanningRepositoryPrisma
  implements DescriptionMaintenancePlanningRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_descricao_planejamento_manutencao;

  async findByEquipmentCode(
    clientId: number,
    code: string,
  ): Promise<IDescriptionMaintenancePlanning['findByEquipmentCode'] | null> {
    const descriptionMaintenance = await this.table.findFirst({
      select: {
        id: true,
        descricao: true,
        status_programacao: true,
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
          },
        },
        taskPlanningMaintenance: {
          select: {
            id: true,
            periodicidade_uso: true,
            valor_base: true,
            unityPlans: {
              select: {
                id: true,
                unidade: true,
              },
            },
            task: {
              select: {
                id: true,
                tarefa: true,
              },
            },
          },
        },
      },
      where: {
        id_cliente: clientId,
        equipment: {
          equipamento_codigo: {
            contains: code,
          },
        },
      },
    });

    return descriptionMaintenance;
  }

  async insert(
    data: Prisma.sofman_descricao_planejamento_manutencaoUncheckedCreateInput,
  ): Promise<sofman_descricao_planejamento_manutencao> {
    const descriptionMaintenance = await this.table.create({ data });

    return descriptionMaintenance;
  }

  async findByEquipmentAndNameAndUnityAndSectorAndType(
    clientId: number,
    equipmentId: number,
    name: string,
    unityId: number,
    sectorId: number,
    typeMaintenanceId: number,
  ): Promise<sofman_descricao_planejamento_manutencao | null> {
    const descriptionMaintenance = await this.table.findFirst({
      where: {
        id_cliente: clientId,
        id_equipamento: equipmentId,
        descricao: name,
        id_setor_executante: sectorId,
        id_tipo_manutencao: typeMaintenanceId,
        id_unidade_medida: unityId,
      },
    });

    return descriptionMaintenance;
  }

  async findByEquipmentAndName(
    clientId: number,
    equipmentId: number,
    name: string,
  ): Promise<sofman_descricao_planejamento_manutencao | null> {
    const descriptionMaintenance = await this.table.findFirst({
      where: {
        id_cliente: clientId,
        id_equipamento: equipmentId,
        descricao: name,
      },
    });

    return descriptionMaintenance;
  }
}
