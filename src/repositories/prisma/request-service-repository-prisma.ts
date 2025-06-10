import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IRequestService } from 'src/models/IRequestService';
import RequestServiceRepository from '../request-service-repository';
import { Prisma, sofman_solicitacoes_servico } from '@prisma/client';

@Injectable()
export default class RequestServiceRepositoryPrisma
  implements RequestServiceRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_solicitacoes_servico;

  async findById(id: number): Promise<IRequestService['findById'] | null> {
    const service = await this.table.findFirst({
      select: {
        id: true,
        codigo_solicitacao: true,
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
        orderService: {
          select: {
            ID: true,
            ordem: true,
            descricao_solicitacao: true,
          },
        },
        sectorExecutor: {
          select: {
            Id: true,
            descricao: true,
          },
        },
        assunto: true,
        mensagem: true,
        prioridade: true,
        statusRequest: {
          select: {
            id: true,
            descricao: true,
          },
        },
        data_inicio: true,
        data_termino: true,
        log_date: true,
      },
      where: {
        id,
      },
    });

    return service;
  }

  async findByIdApp(
    id: string,
  ): Promise<IRequestService['findByIdApp'] | null> {
    const service = await this.table.findFirst({
      select: {
        id: true,
        codigo_solicitacao: true,
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
        orderService: {
          select: {
            ID: true,
            ordem: true,
            descricao_solicitacao: true,
          },
        },
        sectorExecutor: {
          select: {
            Id: true,
            descricao: true,
          },
        },
        assunto: true,
        mensagem: true,
        prioridade: true,
        statusRequest: {
          select: {
            id: true,
            descricao: true,
          },
        },
        data_inicio: true,
        data_termino: true,
        log_date: true,
      },
      where: {
        id_app: id,
      },
    });

    return service;
  }

  async listByClient(
    clientId: number,
    minDate: Date,
  ): Promise<IRequestService['listByClient'][]> {
    const service = await this.table.findMany({
      select: {
        id: true,
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
        orderService: {
          select: {
            ID: true,
            ordem: true,
            descricao_solicitacao: true,
          },
        },
        sectorExecutor: {
          select: {
            Id: true,
            descricao: true,
          },
        },
        assunto: true,
        mensagem: true,
        prioridade: true,
        statusRequest: {
          select: {
            id: true,
            descricao: true,
          },
        },
        data_inicio: true,
        data_termino: true,
        log_date: true,
      },
      where: {
        id_cliente: clientId,
        log_date: {
          gte: minDate,
        },
      },
    });

    return service;
  }

  async listByBranches(
    branches: number[],
    filter?: Prisma.sofman_solicitacoes_servicoWhereInput | null,
  ): Promise<IRequestService['listByBranches'][]> {
    const service = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
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
        orderService: {
          select: {
            ID: true,
            ordem: true,
            descricao_solicitacao: true,
          },
        },
        sectorExecutor: {
          select: {
            Id: true,
            descricao: true,
          },
        },
        assunto: true,
        mensagem: true,
        prioridade: true,
        statusRequest: {
          select: {
            id: true,
            descricao: true,
          },
        },
        data_inicio: true,
        data_termino: true,
        log_date: true,
      },
      where: {
        branch: {
          ID: {
            in: branches,
          },
        },
        ...filter,
      },
    });

    return service;
  }

  async countByClientAndBranch(
    clientId: number,
    branchId: number,
  ): Promise<number> {
    try {
      const count = await this.table.count({
        where: {
          id_cliente: clientId,
          branch: {
            ID: branchId,
          },
        },
      });

      return count;
    } catch (error) {
      throw {
        stack: error.stack,
        message: error.message.includes('Error occurred')
          ? `Error occurred${error.message.split('Error occurred')[1]}`
          : error.message,
      };
    }
  }

  async create(
    data: Prisma.sofman_solicitacoes_servicoUncheckedCreateInput,
  ): Promise<sofman_solicitacoes_servico> {
    try {
      const obj = await this.table.create({
        data,
      });

      return obj;
    } catch (error) {
      throw {
        stack: error.stack,
        message: error.message.includes('Error occurred')
          ? `Error occurred${error.message.split('Error occurred')[1]}`
          : error.message,
        data,
      };
    }
  }

  async update(
    id: number,
    data: Prisma.sofman_solicitacoes_servicoUncheckedUpdateInput,
  ): Promise<sofman_solicitacoes_servico> {
    try {
      const obj = await this.table.update({
        data,
        where: {
          id: id,
        },
      });

      return obj;
    } catch (error) {
      throw {
        stack: error.stack,
        message: error.message.includes('Error occurred')
          ? `Error occurred${error.message.split('Error occurred')[1]}`
          : error.message,
        data,
      };
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.table.delete({
        where: {
          id,
        },
      });

      return true;
    } catch (error) {
      throw {
        stack: error.stack,
        message: error.message.includes('Error occurred')
          ? `Error occurred${error.message.split('Error occurred')[1]}`
          : error.message,
        data: id,
      };
    }
  }
}
