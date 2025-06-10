import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IProvider } from 'src/models/IProvider';
import ProviderRepository from '../provider-repository';
import { Prisma, sofman_cad_fornecedores } from '@prisma/client';

@Injectable()
export default class ProviderRepositoryPrisma implements ProviderRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_cad_fornecedores;

  async create(
    data: Prisma.sofman_cad_fornecedoresUncheckedCreateInput,
  ): Promise<sofman_cad_fornecedores> {
    const provider = await this.table.create({ data });

    return provider;
  }

  async findByClientAndCNPJ(
    clientId: number,
    cnpj: string,
  ): Promise<IProvider['findByClientAndCNPJ'] | null> {
    const provider = await this.table.findFirst({
      select: {
        ID: true,
        razao_social: true,
        cnpj: true,
        dias: true,
      },
      where: {
        ID_cliente: clientId,
        cnpj,
      },
    });

    return provider;
  }

  async listByClient(clientId: number): Promise<IProvider['listByClient'][]> {
    const provider = await this.table.findMany({
      select: {
        ID: true,
        razao_social: true,
        cnpj: true,
        dias: true,
      },
      where: {
        ID_cliente: clientId,
      },
    });

    return provider;
  }

  async listByBranches(
    branches: number[],
    clientId: number,
  ): Promise<IProvider['listByClient'][]> {
    const provider = await this.table.findMany({
      select: {
        ID: true,
        razao_social: true,
        cnpj: true,
        dias: true,
      },
      where: {
        OR: [
          {
            providerForBranch: {
              some: {
                id_filial: {
                  in: branches,
                },
              },
            },
          },
          {
            ID_cliente: clientId,
          },
        ],
      },
    });

    return provider;
  }

  async findById(id: number): Promise<IProvider['findById'] | null> {
    const provider = await this.table.findUnique({
      select: {
        ID: true,
        cnpj: true,
        razao_social: true,
        nome_fantasia: true,
        dias: true,
      },
      where: {
        ID: id,
      },
    });

    return provider;
  }
}
