import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import ManagerCompanyRepository from '../manager-company-repository';
import { IManagerCompany } from 'src/models/IManagerCompany';
import {
  Prisma,
  smartnewsystem_gestor_empresa_x_usuario,
} from '@prisma/client';

@Injectable()
export default class ManagerCompanyRepositoryPrisma
  implements ManagerCompanyRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_gestor_empresa_x_usuario;

  async listByLogin(login: string): Promise<IManagerCompany['listByLogin'][]> {
    const company = await this.table.findMany({
      select: {
        id: true,
        companyBound: {
          select: {
            ID: true,
            nome_fantasia: true,
            razao_social: true,
            cnpj: true,
          },
        },
      },
      where: {
        user: login,
      },
    });

    return company;
  }

  async create(
    data: Prisma.smartnewsystem_gestor_empresa_x_usuarioUncheckedCreateInput,
  ): Promise<smartnewsystem_gestor_empresa_x_usuario> {
    const company = await this.table.create({
      data,
    });

    return company;
  }

  async delete(
    id: number,
    data: Prisma.smartnewsystem_gestor_empresa_x_usuarioUncheckedUpdateInput,
  ): Promise<smartnewsystem_gestor_empresa_x_usuario> {
    const company = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return company;
  }
}
