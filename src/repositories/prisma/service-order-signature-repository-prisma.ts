import { Injectable } from '@nestjs/common';
import { Prisma, sofman_assinatura_ordem_servico } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import ServiceOrderSignatureRepository from '../service-order-signature-repository';

@Injectable()
//implements LogServiceOrderSignatureRepository
export default class ServiceOrderSignatureRepositoryPrisma
  implements ServiceOrderSignatureRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_assinatura_ordem_servico;

  async findById(id: number): Promise<sofman_assinatura_ordem_servico | null> {
    const obj = await this.table.findFirst({
      where: {
        id,
      },
    });

    return obj;
  }

  async create(
    data: Prisma.sofman_assinatura_ordem_servicoUncheckedCreateInput,
  ): Promise<sofman_assinatura_ordem_servico> {
    const signature = await this.table.create({ data });

    return signature;
  }

  async update(
    id: number,
    data: Prisma.sofman_assinatura_ordem_servicoUncheckedUpdateInput,
  ): Promise<sofman_assinatura_ordem_servico> {
    const signature = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return signature;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }
}
