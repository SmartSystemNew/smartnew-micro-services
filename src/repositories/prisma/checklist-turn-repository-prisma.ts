import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_registro_turno } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import CheckListTurnRepository from '../checklist-turn-repository';

@Injectable()
export default class CheckListTurnRepositoryPrisma
  implements CheckListTurnRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_registro_turno;

  async listByClient(
    clientId: number,
  ): Promise<smartnewsystem_registro_turno[]> {
    const turn = await this.table.findMany({
      where: {
        id_cliente: clientId,
      },
    });

    return turn;
  }

  async findById(id: number): Promise<smartnewsystem_registro_turno | null> {
    const turn = await this.table.findUnique({
      where: {
        id,
      },
    });

    return turn;
  }

  async create(
    data: Prisma.smartnewsystem_registro_turnoUncheckedCreateInput,
  ): Promise<smartnewsystem_registro_turno> {
    const turn = await this.table.create({ data });

    return turn;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_registro_turnoUncheckedUpdateInput,
  ): Promise<smartnewsystem_registro_turno> {
    const turn = await this.table.update({
      where: { id },
      data,
    });

    return turn;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }
}
