import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import ILogEquipment from 'src/models/ILogEquipment';
import LogEquipmentRepository from '../log-equipment-repository';

@Injectable()
export default class LogEquipmentRepositoryPrisma
  implements LogEquipmentRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.log_cadastro_de_equipamentos;

  async listByBranches(
    branches: number[],
    filter?: Prisma.log_cadastro_de_equipamentosWhereInput | null,
  ): Promise<ILogEquipment['listByBranches'][]> {
    const log = await this.table.findMany({
      select: {
        ID: true,
        id_equipamento: true,
        acao: true,
        equipamento_codigo: true,
        descricao: true,
        placa: true,
        chassi: true,
        n_serie: true,
        observacoes: true,
        equipment: {
          select: {
            ID: true,
            descriptionPlanMaintenance: {
              select: {
                id: true,
              },
            },
            branch: {
              select: {
                ID: true,
                filial_numero: true,
              },
            },
            costCenter: {
              select: {
                ID: true,
                centro_custo: true,
              },
            },
            typeEquipment: {
              select: {
                ID: true,
                tipo_equipamento: true,
              },
            },
          },
        },
      },
      where: {
        equipment: {
          branch: {
            ID: {
              in: branches,
            },
          },
        },
        ...filter,
      },
    });

    return log;
  }
}
