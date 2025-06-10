import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IBuyPriority } from 'src/models/IBuyPriority';
import BuyPriorityRepository from '../buy-priority-repository';

@Injectable()
export default class BuyPriorityRepositoryPrisma
  implements BuyPriorityRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_prioridade;

  async listByClient(
    clientId: number,
  ): Promise<IBuyPriority['listByClient'][]> {
    const priority = await this.table.findMany({
      select: {
        id: true,
        name: true,
        prazo: true,
      },
      where: {
        id_cliente: clientId,
      },
    });

    return priority;
  }

  async findById(id: number): Promise<IBuyPriority['findById'] | null> {
    const priority = await this.table.findFirst({
      select: {
        id: true,
        name: true,
        prazo: true,
      },
      where: {
        id,
      },
    });

    return priority;
  }
}
