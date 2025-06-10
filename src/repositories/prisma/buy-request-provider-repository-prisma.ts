import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import BuyRequestProviderRepository from '../buy-request-provider-repository';

@Injectable()
export default class BuyRequestProviderRepositoryPrisma
  implements BuyRequestProviderRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_pedido_fornecedor;

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
