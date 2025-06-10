import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import ILogMaterialServiceOrder from 'src/models/ILogMaterialServiceOrder';
import LogMaterialServiceOrdeRepository from '../log-material-service-order-repository';

@Injectable()
export default class LogMaterialServiceOrderRepositoryPrisma
  implements LogMaterialServiceOrdeRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.log_sofman_materiais_ordem_servico;

  async listLogMaterialOrder(
    branches: number[],
    filter?: Prisma.log_sofman_materiais_ordem_servicoWhereInput | null,
  ): Promise<ILogMaterialServiceOrder['listLogMaterialOrder'][]> {
    const obj = await this.table.findMany({
      select: {
        id: true,
        id_app: true,
        id_material_servico: true,
        acao: true,
        id_ordem_servico: true,
        material: true,
        quantidade: true,
        valor_unidade: true,
        valor_total: true,
        data_uso: true,
        n_serie_novo: true,
        n_serie_antigo: true,
        log_date: true,
      },
      where: {
        serviceOrder: {
          ID_filial: {
            in: branches,
          },
        },

        ...filter,
      },
    });

    return obj;
  }
}
