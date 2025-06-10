import { Injectable } from '@nestjs/common';
import { Prisma, sofman_cad_colaboradores } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import ColaboratorRepository from '../colaborator-repository';

@Injectable()
export default class ColaboratorRepositoryPrisma
  implements ColaboratorRepository
{
  constructor(private prismaService: PrismaService) {}
  private table = this.prismaService.sofman_cad_colaboradores;

  async ListByClient(
    clientId: number,
    filter?: Prisma.sofman_cad_colaboradoresWhereInput | null,
  ): Promise<sofman_cad_colaboradores[]> {
    const colaborator = this.table.findMany({
      where: {
        id_cliente: clientId,
        ...filter,
      },
    });
    return colaborator;
  }

  async findByIdAndClient(
    collaboratorId: number,
    clientId: number,
  ): Promise<sofman_cad_colaboradores | null> {
    return await this.prismaService.sofman_cad_colaboradores.findFirst({
      where: {
        id: collaboratorId,
        id_cliente: clientId,
      },
    });
  }

  async findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<sofman_cad_colaboradores | null> {
    return await this.prismaService.sofman_cad_colaboradores.findFirst({
      where: {
        nome: name,
        id_cliente: clientId,
      },
    });
  }

  async create(
    data: Prisma.sofman_cad_colaboradoresUncheckedCreateInput,
  ): Promise<sofman_cad_colaboradores> {
    const requester = await this.prismaService.sofman_cad_colaboradores.create({
      data,
    });

    return requester;
  }
}
