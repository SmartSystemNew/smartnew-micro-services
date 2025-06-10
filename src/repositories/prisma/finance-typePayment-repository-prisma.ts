import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import IFinanceTypePayment from 'src/models/IFinanceTypePayment';
import FinanceTypePaymentRepository from '../finance-typePayment-repository';
import {
  Prisma,
  smartnewsystem_financeiro_tipos_pagamento,
} from '@prisma/client';
@Injectable()
export default class FinanceTypePaymentRepositoryPrisma
  implements FinanceTypePaymentRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_financeiro_tipos_pagamento;

  async create(
    data: Prisma.smartnewsystem_financeiro_tipos_pagamentoUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_tipos_pagamento> {
    const typePayment = await this.table.create({ data });
    return typePayment;
  }

  async listByClient(
    clientId: number,
  ): Promise<IFinanceTypePayment['listByClient'][]> {
    const typePayment = await this.table.findMany({
      select: {
        id: true,
        descricao: true,
        parcela: true,
      },
      where: {
        id_cliente: clientId,
      },
    });

    return typePayment;
  }

  async findById(id: number): Promise<IFinanceTypePayment['findById']> {
    const typePayment = await this.table.findUnique({
      select: {
        id: true,
        descricao: true,
        parcela: true,
      },
      where: {
        id,
      },
    });

    return typePayment;
  }
}
