import { Injectable } from '@nestjs/common';
import { sofman_calcula_planos } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export default class CalculePlanRepositoryPrisma {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_calcula_planos;

  async listByClient(clientId: number): Promise<sofman_calcula_planos[]> {
    const result = await this.table.findMany({
      where: {
        id_cliente: clientId,
      },
    });

    return result;
  }
}
