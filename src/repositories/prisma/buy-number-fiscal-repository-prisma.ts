import { PrismaService } from 'src/database/prisma.service';
import { BuyNumberFiscalRepository } from '../buy-number-fiscal-repository';
import { Injectable } from '@nestjs/common';
import { smartnewsystem_compras_solicitacao } from '@prisma/client';

@Injectable()
export class BuyNumberFiscalRepositoryPrisma
  implements BuyNumberFiscalRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_numeros_fiscais;

  async list(
    clientId: number,
    startDate: Date,
  ): Promise<
    ({
      requestProvider: {
        id: number;
        id_pedido: number;
        id_fornecedor: number;
        id_finance?: number;
      }[];
    } & {
      buy: smartnewsystem_compras_solicitacao;
    } & {
      id: number;
      id_compra: number;
    })[]
  > {
    const fiscal = await this.table.findMany({
      include: {
        requestProvider: true,
        buy: true,
      },
      where: {
        buy: {
          fechamento: {
            gte: startDate,
          },
          id_cliente: clientId,
        },
      },
    });

    return fiscal;
  }
}
