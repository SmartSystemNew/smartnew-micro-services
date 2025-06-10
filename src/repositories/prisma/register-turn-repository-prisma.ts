import { Injectable } from '@nestjs/common';
import { smartnewsystem_registro_turno } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export default class RegisterTurnRepositoryPrisma {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_registro_turno;

  async listByBranch(
    branchId: number,
  ): Promise<smartnewsystem_registro_turno[]> {
    const turn = await this.table.findMany({
      where: {
        id_filial: branchId,
      },
    });

    return turn;
  }
}
