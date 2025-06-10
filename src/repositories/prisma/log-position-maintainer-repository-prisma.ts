import { Injectable } from '@nestjs/common';
// import { log_sofman_cad_cargos_mantenedores } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import LogPositionMaintainerRepository from '../log-position-maintainer-repository';
import { ILogPositionMaintainer } from 'src/models/ILogPositionMaintainer';

@Injectable()
export class LogPositionMaintainerRepositoryPrisma
  implements LogPositionMaintainerRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.log_sofman_cad_cargos_mantenedores;

  async findById(id: number): Promise<ILogPositionMaintainer['findById']> {
    const position = await this.table.findFirst({
      select: {
        id: true,
        id_cliente: true,
        id_descricao: true,
        descricao: true,
        acao: true,
        log_date: true,
      },
      where: {
        id,
      },
    });

    return position;
  }

  async list(clientId: number): Promise<ILogPositionMaintainer['list'][]> {
    const positions = await this.table.findMany({
      select: {
        id: true,
        id_cliente: true,
        id_descricao: true,
        descricao: true,
        acao: true,
        log_date: true,
      },
      where: {
        id_cliente: clientId,
      },
    });

    return positions;
  }
}
