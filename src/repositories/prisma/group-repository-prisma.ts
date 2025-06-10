import { Injectable } from '@nestjs/common';
import { sec_groups } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import GroupRepository from '../group-repository';

@Injectable()
export default class GroupRepositoryPrisma implements GroupRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sec_groups;

  async listByClient(clientId: number): Promise<sec_groups[]> {
    const group = await this.table.findMany({
      where: {
        id_cliente: clientId,
      },
    });

    return group;
  }
}
