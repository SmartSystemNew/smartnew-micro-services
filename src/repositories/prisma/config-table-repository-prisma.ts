import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_configuracao_tabela } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import ConfigTableRepository from '../config-table-repository';
import IConfigTable from 'src/models/IConfigTable';

@Injectable()
export default class ConfigTableRepositoryPrisma
  implements ConfigTableRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_configuracao_tabela;

  async listByClient(
    clientId: number,
    filter?: Prisma.smartnewsystem_configuracao_tabelaWhereInput,
  ): Promise<smartnewsystem_configuracao_tabela[]> {
    const configs = await this.table.findMany({
      where: {
        id_cliente: clientId,
        ...filter,
      },
    });

    return configs;
  }

  async findByClientOnly(
    clientId: number,
    filter?: Prisma.smartnewsystem_configuracao_tabelaWhereInput,
  ): Promise<smartnewsystem_configuracao_tabela | null> {
    const configs = await this.table.findFirst({
      where: {
        id_cliente: clientId,
        user: null,
        ...filter,
      },
    });

    return configs;
  }

  async findById(
    id: number,
  ): Promise<smartnewsystem_configuracao_tabela | null> {
    const configs = await this.table.findFirst({
      where: {
        id,
      },
    });

    return configs;
  }

  async findByUserOnly(
    clientId: number,
    user: string,
    filter?: Prisma.smartnewsystem_configuracao_tabelaWhereInput,
  ): Promise<IConfigTable['listByUserOnly'] | null> {
    const configs = await this.table.findFirst({
      where: {
        id_cliente: clientId,
        user,
        ...filter,
      },
    });

    return configs;
  }

  async create(
    data: Prisma.smartnewsystem_configuracao_tabelaUncheckedCreateInput,
  ): Promise<smartnewsystem_configuracao_tabela> {
    const config = await this.table.create({
      data,
    });

    return config;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_configuracao_tabelaUncheckedUpdateInput,
  ): Promise<smartnewsystem_configuracao_tabela> {
    const config = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return config;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
