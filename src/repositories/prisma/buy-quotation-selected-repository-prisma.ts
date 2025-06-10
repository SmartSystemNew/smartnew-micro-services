import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import IBuyQuotationSelected from 'src/models/IBuyQuotationSelected';
import BuyQuotationSelectedRepository from '../buy-quotation-selected-repository';
import {
  Prisma,
  smartnewsystem_compras_cotacao_selecionada,
} from '@prisma/client';

@Injectable()
export default class BuyQuotationSelectedRepositoryPrisma
  implements BuyQuotationSelectedRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_cotacao_selecionada;

  async listByBuy(
    buyId: number,
  ): Promise<IBuyQuotationSelected['listByBuy'][]> {
    const selectedQuotation = await this.table.findMany({
      select: {
        id: true,
        aprovado: true,
        buy: {
          select: {
            id: true,
            numero: true,
          },
        },
        quotationItem: {
          select: {
            id: true,
            quantidade: true,
            valor: true,
            observacao: true,
            quotation: {
              select: {
                id: true,
                provider: {
                  select: {
                    ID: true,
                    nome_fantasia: true,
                  },
                },
              },
            },
            item: {
              select: {
                id: true,
                sequencia: true,
                vinculo: true,
                quantidade: true,
                material: {
                  select: {
                    id: true,
                    material: true,
                  },
                },
                compositionItem: {
                  select: {
                    id: true,
                    composicao: true,
                    descricao: true,
                  },
                },
                equipment: {
                  select: {
                    ID: true,
                    equipamento_codigo: true,
                    descricao: true,
                  },
                },
                serviceOrder: {
                  select: {
                    ID: true,
                    ordem: true,
                    descricao_solicitacao: true,
                    equipment: {
                      select: {
                        ID: true,
                        equipamento_codigo: true,
                        descricao: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id_compra: buyId,
      },
    });

    return selectedQuotation;
  }

  async create(
    data: Prisma.smartnewsystem_compras_cotacao_selecionadaUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_cotacao_selecionada> {
    const selectedQuotation = await this.table.create({
      data,
    });

    return selectedQuotation;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_compras_cotacao_selecionadaUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_cotacao_selecionada> {
    const selectedQuotation = await this.table.update({
      where: { id },
      data,
    });

    return selectedQuotation;
  }

  async deleteByBuy(buyId: number): Promise<boolean> {
    await this.table.deleteMany({ where: { id_compra: buyId } });

    return true;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }
}
