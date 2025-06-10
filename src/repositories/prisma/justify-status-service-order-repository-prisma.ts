import { Injectable } from '@nestjs/common';
import { Prisma, sofman_justificativa_status } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import JustifyStatusServiceOrderRepository from '../justify-status-service-order-repository';

@Injectable()
export default class JustifyStatusServiceOrderRepositoryPrisma
  implements JustifyStatusServiceOrderRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_justificativa_status;

  async findById(id: number): Promise<sofman_justificativa_status | null> {
    const status = await this.table.findUnique({
      where: {
        id,
      },
    });

    return status;
  }

  async create(
    data: Prisma.sofman_justificativa_statusCreateInput,
  ): Promise<sofman_justificativa_status> {
    const status = await this.table.create({
      data,
    });

    return status;
  }

  async update(
    id: number,
    data: Prisma.sofman_justificativa_statusUncheckedUpdateInput,
  ): Promise<sofman_justificativa_status> {
    const status = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return status;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
