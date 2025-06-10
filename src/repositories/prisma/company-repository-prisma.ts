import { Injectable } from '@nestjs/common';
import { Prisma, cadastro_de_empresas } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { ICompany } from 'src/models/ICompany';
import { CompanyRepository } from '../company-repository';

@Injectable()
export default class CompanyRepositoryPrisma implements CompanyRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.cadastro_de_empresas;

  async insert(
    data: Prisma.cadastro_de_empresasUncheckedCreateInput,
  ): Promise<cadastro_de_empresas> {
    const company = await this.table.create({
      data,
    });

    return company;
  }

  async update(
    data: Prisma.cadastro_de_empresasUncheckedCreateInput,
  ): Promise<cadastro_de_empresas> {
    const company = await this.table.update({
      data,
      where: {
        ID: data.ID,
      },
    });

    return company;
  }

  async findById(id: number): Promise<ICompany['findById'] | null> {
    const company = await this.table.findUnique({
      select: {
        ID: true,
        razao_social: true,
        cnpj: true,
        n_licencas: true,
      },
      where: {
        ID: id,
      },
    });

    return company;
  }
}
