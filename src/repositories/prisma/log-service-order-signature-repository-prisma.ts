import { Injectable } from '@nestjs/common';
import { Prisma, log_sofman_assinatura_ordem_servico } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import LogServiceOrderSignatureRepository from '../log-service-order-signature-repository';

@Injectable()
export default class LogServiceOrderSignatureRepositoryPrisma
  implements LogServiceOrderSignatureRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.log_sofman_assinatura_ordem_servico;

  async findLastBySignature(
    signatureId: number,
  ): Promise<log_sofman_assinatura_ordem_servico | null> {
    const obj = await this.table.findFirst({
      where: {
        id_assinatura: signatureId,
      },
      orderBy: {
        id: 'desc',
      },
    });
    return obj;
  }

  async listByBranches(
    branches: number[],
    filter?: Prisma.log_sofman_assinatura_ordem_servicoWhereInput | null,
  ): Promise<log_sofman_assinatura_ordem_servico[]> {
    const obj = await this.table.findMany({
      where: {
        signatureServiceOrder: {
          serviceOrder: {
            ID_filial: {
              in: branches,
            },
          },
        },
        ...filter,
      },
    });
    return obj;
  }

  async update(
    id: number,
    data: Prisma.log_sofman_assinatura_ordem_servicoUncheckedUpdateInput,
  ): Promise<log_sofman_assinatura_ordem_servico> {
    const log = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return log;
  }
}
