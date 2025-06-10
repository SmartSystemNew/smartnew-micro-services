import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_compras_pedidos_falta } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import BuyRequestFaultRepository from '../buy-request-fault-repository';

@Injectable()
export default class BuyRequestFaultRepositoryPrisma
  implements BuyRequestFaultRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_pedidos_falta;

  async create(
    data: Prisma.smartnewsystem_compras_pedidos_faltaUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_pedidos_falta> {
    const fault = await this.table.create({ data });

    return fault;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_compras_pedidos_faltaUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_pedidos_falta> {
    const fault = await this.table.update({ where: { id }, data });

    return fault;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }
}
