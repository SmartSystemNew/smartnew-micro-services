import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma, sofman_cad_tipos_manutencao } from '@prisma/client';
import { TypeMaintenanceRepository } from '../type-maintenance-repository';
import { ITypeMaintenance } from 'src/models/ITypeMaintenance';
import { querySetSelect } from 'src/service/querySelect.service';
import { querySetFilter } from 'src/service/queryFilters.service';

@Injectable()
export default class TypeMaintenanceRepositoryPrisma
  implements TypeMaintenanceRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_cad_tipos_manutencao;

  async findByClientAndType(
    clientId: number,
    type: string,
  ): Promise<sofman_cad_tipos_manutencao | null> {
    const typeMaintenance = await this.table.findFirst({
      where: {
        ID_cliente: clientId,
        tipo_manutencao: type,
      },
    });

    return typeMaintenance;
  }

  async findById(id: number): Promise<ITypeMaintenance['findById'] | null> {
    const obj = await this.table.findFirst({
      select: {
        ID: true,
        ID_cliente: true,
        ID_filial: true,
        sigla: true,
        tipo_manutencao: true,
        padrao: true,
        id_grupo: true,
        status: true,
        ordem_programada: true,
        observacoes: true,
        notifica_encerramento: true,
        incluir_solicitacao: true,
        id_plano_padrao: true,
        log_user: true,
        log_date: true,
      },
      where: {
        ID: id,
      },
    });
    return obj;
  }

  async create(
    data: Prisma.sofman_cad_tipos_manutencaoUncheckedCreateInput,
  ): Promise<sofman_cad_tipos_manutencao> {
    const obj = await this.table.create({
      data,
    });

    return obj;
  }

  async update(
    id: number,
    data: Prisma.sofman_cad_tipos_manutencaoUncheckedUpdateInput,
  ): Promise<sofman_cad_tipos_manutencao> {
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

  async listByClient(
    idClient: number,
    filters: Prisma.sofman_cad_tipos_manutencaoWhereInput = {},
    fields: string[] = [],
  ): Promise<ITypeMaintenance['listByClient'][]> {
    const dataInit: Prisma.sofman_cad_tipos_manutencaoWhereInput = {
      ID_cliente: idClient,
    };
    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_cad_tipos_manutencaoSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            ID: true,
            ID_cliente: true,
            ID_filial: true,
            sigla: true,
            tipo_manutencao: true,
            padrao: true,
            id_grupo: true,
            status: true,
            ordem_programada: true,
            observacoes: true,
            notifica_encerramento: true,
            incluir_solicitacao: true,
            id_plano_padrao: true,
            log_user: true,
            log_date: true,
          };

    filters = Object.keys(filters).length > 0 && querySetFilter(filters);

    const obj = await this.table.findMany({
      select: select,
      where: { ...dataInit, ...filters },
    });

    return obj;
  }
}
