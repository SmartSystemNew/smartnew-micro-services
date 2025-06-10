import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IBranch, IBranchFindById } from 'src/models/IBranch';
import { BranchRepository } from '../branch-repository';
import { cadastro_de_filiais, Prisma } from '@prisma/client';

@Injectable()
export class BranchRepositoryPrisma implements BranchRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.cadastro_de_filiais;

  async findById(id: number): Promise<IBranchFindById | null> {
    const branch = await this.table.findFirst({
      select: {
        ID: true,
        filial_numero: true,
        nome_fantasia: true,
        cnpj: true,
        company: {
          select: {
            ID: true,
            razao_social: true,
            cnpj: true,
          },
        },
      },
      where: {
        ID: id,
      },
    });

    return branch;
  }

  async listByIds(id: number[]): Promise<IBranch['listByIds'][]> {
    const branch = await this.table.findMany({
      select: {
        ID: true,
        filial_numero: true,
        nome_fantasia: true,
        cnpj: true,
      },
      where: {
        ID: {
          in: id,
        },
      },
    });

    return branch;
  }

  async findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<IBranch['findByClientAndName'] | null> {
    const branch = await this.table.findFirst({
      select: {
        ID: true,
        filial_numero: true,
        nome_fantasia: true,
        cnpj: true,
      },
      where: {
        ID_cliente: clientId,
        nome_fantasia: name,
      },
    });

    return branch;
  }

  async findByClientAndCNPJ(
    clientId: number,
    cnpj: string,
  ): Promise<IBranch['findByClientAndCNPJ'] | null> {
    const branch = await this.table.findFirst({
      select: {
        ID: true,
        filial_numero: true,
        nome_fantasia: true,
        cnpj: true,
      },
      where: {
        ID_cliente: clientId,
        cnpj,
      },
    });

    return branch;
  }

  async create(
    data: Prisma.cadastro_de_filiaisUncheckedCreateInput,
  ): Promise<cadastro_de_filiais> {
    const branch = await this.table.create({
      data,
    });

    return branch;
  }
}
