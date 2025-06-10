import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma, sofman_anexos_os } from '@prisma/client';
import { querySetSelect } from 'src/service/querySelect.service';
import { querySetFilter } from 'src/service/queryFilters.service';
import { AttachmentsServiceOrderRepository } from '../attachments-service-order-repository';
import { IAttachmentsServiceOrder } from 'src/models/IAttachmentsServiceOrder';

@Injectable()
export default class AttachmentsServiceOrderRepositoryPrisma
  implements AttachmentsServiceOrderRepository
{
  private table = this.prismaService.sofman_anexos_os;

  constructor(private prismaService: PrismaService) {}
  async findById(
    id: number,
  ): Promise<IAttachmentsServiceOrder['findById'] | null> {
    const obj = await this.table.findFirst({
      select: {
        id: true,
        id_cliente: true,
        id_filial: true,
        id_ordem_servico: true,
        anexo: true,
        nome_anexo: true,
        tamanho_anexo: true,
        observacao: true,
        log_date: true,
        log_user: true,
        url: true,
      },
      where: {
        id: id,
      },
    });

    return obj;
  }

  async create(
    data: Prisma.sofman_anexos_osUncheckedCreateInput,
  ): Promise<sofman_anexos_os> {
    const obj = await this.table.create({
      data,
    });

    return obj;
  }

  async update(
    id: number,
    data: Prisma.sofman_anexos_osUncheckedUpdateInput,
  ): Promise<sofman_anexos_os> {
    const obj = await this.table.update({
      data,
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
  async listByServiceOrder(
    idServiceOrder: number,
    filters: Prisma.sofman_anexos_osWhereInput = {},
    fields: string[] = [],
  ): Promise<IAttachmentsServiceOrder['listByServiceOrder'][]> {
    const where: Prisma.sofman_anexos_osWhereInput = {
      id_ordem_servico: idServiceOrder,
    };

    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_anexos_osSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            id: true,
            id_cliente: true,
            id_filial: true,
            id_ordem_servico: true,
            anexo: true,
            nome_anexo: true,
            tamanho_anexo: true,
            observacao: true,
            log_date: true,
            log_user: true,
            url: true,
          };

    filters = Object.keys(filters).length > 0 && querySetFilter(filters);

    const obj = await this.table.findMany({
      select: select,
      where: { ...where, ...filters },
    });
    return obj;
  }
}
