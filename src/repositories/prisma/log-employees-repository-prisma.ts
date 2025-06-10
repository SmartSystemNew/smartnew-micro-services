import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import LogEmployeesRepository from '../log-employees-repository';
import ILogEmployees from 'src/models/ILogEmployees';

@Injectable()
export default class LogEmployeesRepositoryPrisma
  implements LogEmployeesRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.log_sofman_cad_colaboradores;

  async listByClient(
    clientId: number,
    filter?: Prisma.log_sofman_cad_colaboradoresWhereInput | null,
  ): Promise<ILogEmployees['listByClient'][]> {
    const employees = await this.table.findMany({
      select: {
        id: true,
        id_colaborador: true,
        acao: true,
        nome: true,
        status: true,
        collaborator: {
          select: {
            id: true,
            user: {
              select: {
                login: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        id_cliente: clientId,
        ...filter,
      },
    });

    return employees;
  }
}
