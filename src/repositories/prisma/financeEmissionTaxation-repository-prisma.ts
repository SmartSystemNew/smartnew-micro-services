import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IFinanceEmissionTaxation } from 'src/models/IFinanceEmissionTaxation';
import FinanceEmissionTaxationRepository from '../financeEmissionTaxation-repository';
import {
  Prisma,
  smartnewsystem_financeiro_emissao_tributos,
} from '@prisma/client';

@Injectable()
export default class FinanceEmissionTaxationRepositoryPrisma
  implements FinanceEmissionTaxationRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_financeiro_emissao_tributos;

  async findById(
    id: number,
  ): Promise<IFinanceEmissionTaxation['findById'] | null> {
    const emissionTaxation = await this.table.findUnique({
      select: {
        id: true,
        observacao: true,
        tipo: true,
        valor: true,
        taxation: {
          select: {
            id: true,
            descricao: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return emissionTaxation;
  }

  async listByEmission(
    emissionId: number,
  ): Promise<IFinanceEmissionTaxation['listByEmission'][]> {
    const emissionTaxation = await this.table.findMany({
      select: {
        id: true,
        taxation: {
          select: {
            id: true,
            descricao: true,
          },
        },
        observacao: true,
        valor: true,
        tipo: true,
      },
      where: {
        id_emissao: emissionId,
      },
    });

    return emissionTaxation;
  }

  async listByPayment(
    paymentId: number,
  ): Promise<IFinanceEmissionTaxation['listByPayment'][]> {
    const emissionTaxation = await this.table.findMany({
      select: {
        id: true,
        taxation: {
          select: {
            id: true,
            descricao: true,
          },
        },
        observacao: true,
        valor: true,
        tipo: true,
      },
      where: {
        id_pagamento: paymentId,
      },
    });

    return emissionTaxation;
  }

  async insert(
    data: Prisma.smartnewsystem_financeiro_emissao_tributosUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_emissao_tributos> {
    const emissionTaxation = await this.table.create({
      data,
    });

    return emissionTaxation;
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
