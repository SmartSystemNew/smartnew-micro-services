import { Injectable } from '@nestjs/common';
import { Prisma, sofman_unidade_medida_planos_prev } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import UnityOfMensurePlansRepository from '../unity-of-mensure-plans-repository';

@Injectable()
export default class UnityOfMensurePlansRepositoryPrisma
  implements UnityOfMensurePlansRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_unidade_medida_planos_prev;

  async findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<sofman_unidade_medida_planos_prev | null> {
    const unity = await this.table.findFirst({
      where: {
        id_cliente: clientId,
        unidade: name,
      },
    });

    return unity;
  }

  async findByClient(
    clientId: number,
  ): Promise<sofman_unidade_medida_planos_prev[]> {
    const unity = await this.table.findMany({
      where: {
        id_cliente: clientId,
      },
    });

    return unity;
  }

  async insert(
    data: Prisma.sofman_unidade_medida_planos_prevUncheckedCreateInput,
  ): Promise<sofman_unidade_medida_planos_prev> {
    const unity = await this.table.create({ data });

    return unity;
  }
}
