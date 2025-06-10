import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_compras_controle_cotacao,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import BuyControlQuotationRepository from '../buy-control-quotation-repository';

@Injectable()
export default class BuyControlQuotationRepositoryPrisma
  implements BuyControlQuotationRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_controle_cotacao;

  async listByClient(
    clientId: number,
  ): Promise<smartnewsystem_compras_controle_cotacao | null> {
    const controlQuotation = await this.table.findFirst({
      where: {
        id_cliente: clientId,
      },
    });

    return controlQuotation;
  }

  async create(
    data: Prisma.smartnewsystem_compras_controle_cotacaoUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_controle_cotacao> {
    const controlQuotations = await this.table.create({
      data,
    });

    return controlQuotations;
  }
}
