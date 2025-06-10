import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_mantenedores_os } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import ServiceOrderMaintainerRepository from '../service-order-maintainer-repository';
import IServiceOrderMaintainer from 'src/models/IServiceOrderMaintainer';

@Injectable()
export default class ServiceOrderMaintainerRepositoryPrisma
  implements ServiceOrderMaintainerRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_mantenedores_os;

  async create(
    data: Prisma.smartnewsystem_mantenedores_osUncheckedCreateInput,
  ): Promise<smartnewsystem_mantenedores_os> {
    const os = await this.table.create({ data });
    return os;
  }

  async findById(id: number): Promise<smartnewsystem_mantenedores_os | null> {
    const os = await this.table.findFirst({
      where: {
        id,
      },
    });
    return os;
  }

  async createOrderAndCollaborator(
    data: Prisma.smartnewsystem_mantenedores_osUncheckedCreateInput,
  ): Promise<smartnewsystem_mantenedores_os> {
    const obj = await this.table.create({
      data: {
        id: data.id,
        id_ordem_servico: data.id_ordem_servico,
        id_colaborador: data.id_colaborador,
      },
    });
    return obj;
  }

  async updateOrderAndCollaborattor(
    id: number,
    data: Prisma.smartnewsystem_mantenedores_osUncheckedUpdateInput,
  ): Promise<smartnewsystem_mantenedores_os> {
    const obj = await this.table.update({
      data: {
        id: data.id,
        id_ordem_servico: data.id_ordem_servico,
        id_colaborador: data.id_colaborador,
      },
      where: {
        id: id,
      },
    });
    return obj;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id: id,
      },
    });

    return true;
  }

  async findByOrderAndCollaborator(
    orderId: number,
    collaboratorId: number,
  ): Promise<smartnewsystem_mantenedores_os | null> {
    const os = await this.table.findFirst({
      where: {
        id_ordem_servico: orderId,
        id_colaborador: collaboratorId,
      },
    });

    return os;
  }

  async listAsyncMaintainers(
    branchId: number[],
  ): Promise<IServiceOrderMaintainer['listAsyncMaintainers'][]> {
    const os = await this.table.findMany({
      select: {
        id: true,
        id_ordem_servico: true,
        id_colaborador: true,
      },
      where: {
        serviceOrder: {
          branch: {
            ID: {
              in: branchId,
            },
          },
        },
      },
    });

    return os;
  }

  async listByService(
    serviceOrderId: number,
  ): Promise<smartnewsystem_mantenedores_os[]> {
    const os = await this.table.findMany({
      where: {
        serviceOrder: {
          ID: serviceOrderId,
        },
      },
    });

    return os;
  }

  async createOrdersMaintainerInBulk(
    ordersId: number[],
    collaboratorId: number[],
  ): Promise<void> {
    const createData = ordersId.flatMap((orderId) =>
      collaboratorId.map((collaboratorId) => ({
        id_ordem_servico: orderId,
        id_colaborador: collaboratorId,
      })),
    );

    await this.table.createMany({
      data: createData,
      skipDuplicates: true,
    });
  }

  async listByBranch(
    branches: number[],
    filter?: Prisma.smartnewsystem_mantenedores_osWhereInput | null,
  ): Promise<IServiceOrderMaintainer['listByBranch'][]> {
    const collaborator = await this.table.findMany({
      select: {
        id: true,
        collaborator: {
          select: {
            id: true,
            nome: true,
          },
        },
        serviceOrder: {
          select: {
            ID: true,
            ordem: true,
            log_date: true,
            data_hora_encerramento: true,
            data_hora_solicitacao: true,
            data_prevista_termino: true,
            branch: {
              select: {
                ID: true,
                filial_numero: true,
              },
            },
            equipment: {
              select: {
                ID: true,
                equipamento_codigo: true,
                descricao: true,
              },
            },
            statusOrderService: {
              select: {
                id: true,
                status: true,
              },
            },
          },
        },
      },
      where: {
        AND: [
          {
            serviceOrder: {
              branch: {
                ID: {
                  in: branches,
                },
              },
            },
          },
          filter,
        ],
      },
    });

    return collaborator;
  }
}
