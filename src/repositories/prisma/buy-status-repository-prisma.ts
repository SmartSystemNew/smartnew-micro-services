import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IBuyStatus } from 'src/models/IBuyStatus';
import BuyStatusRepository from '../buy-status-repository';

@Injectable()
export default class BuyStatusRepositoryPrisma implements BuyStatusRepository {
  constructor(private prismaService: PrismaService) {}
  private table = this.prismaService.smartnewsystem_compras_status;

  async list(): Promise<IBuyStatus['list'][]> {
    const status = await this.table.findMany({
      select: {
        id: true,
        descricao: true,
        icone: true,
      },
    });

    return status;
  }
}
