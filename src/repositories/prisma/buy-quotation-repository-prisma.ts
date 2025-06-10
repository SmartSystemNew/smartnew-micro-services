import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import IBuyQuotation from 'src/models/IBuyQuotation';
import BuyQuotationRepository from '../buy-quotation-repository';
import { Prisma, smartnewsystem_compras_cotacao } from '@prisma/client';

@Injectable()
export default class BuyQuotationRepositoryPrisma
  implements BuyQuotationRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_cotacao;

  async findById(id: number): Promise<IBuyQuotation['findById'] | null> {
    const quotation = await this.table.findUnique({
      select: {
        id: true,
        buy: {
          select: {
            id: true,
            numero: true,
            buyStatus: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        provider: {
          select: {
            ID: true,
            nome_fantasia: true,
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        userClose: {
          select: {
            login: true,
            name: true,
          },
        },
        quotationItem: {
          select: {
            id: true,
            valor: true,
            quantidade: true,
            observacao: true,
            item: {
              select: {
                id: true,
                quantidade: true,
                material: {
                  select: {
                    id: true,
                    material: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });

    return quotation;
  }

  async listByBuy(
    buyId: number,
    filter?: Prisma.smartnewsystem_compras_cotacaoWhereInput | null,
  ): Promise<IBuyQuotation['listByBuy'][]> {
    const quotation = await this.table.findMany({
      select: {
        id: true,
        comentario: true,
        buy: {
          select: {
            id: true,
            numero: true,
            item: {
              select: {
                id: true,
                estoque: true,
              },
            },
            branch: {
              select: {
                ID: true,
                filial_numero: true,
              },
            },
            buyStatus: {
              select: {
                id: true,
                descricao: true,
              },
            },
            buyQuotationDiscount: {
              select: {
                id: true,
                tipo: true,
                valor: true,
                provider: {
                  select: {
                    ID: true,
                    nome_fantasia: true,
                  },
                },
              },
            },
          },
        },
        provider: {
          select: {
            ID: true,
            nome_fantasia: true,
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        userClose: {
          select: {
            login: true,
            name: true,
          },
        },
        quotationItem: {
          select: {
            id: true,
            valor: true,
            quantidade: true,
            observacao: true,
            item: {
              select: {
                id: true,
                sequencia: true,
                quantidade: true,
                vinculo: true,
                compositionItem: {
                  select: {
                    id: true,
                    composicao: true,
                    descricao: true,
                  },
                },
                material: {
                  select: {
                    id: true,
                    codigo: true,
                    material: true,
                  },
                },
                materialSecond: {
                  select: {
                    id: true,
                    codigo: true,
                    especificacao: true,
                    marca: true,
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
        ...filter,
      },
    });

    return quotation;
  }

  async listByProvider(
    providerId: number,
  ): Promise<IBuyQuotation['listByProvider'][]> {
    const quotation = await this.table.findMany({
      select: {
        id: true,
        buy: {
          select: {
            id: true,
            numero: true,
            buyStatus: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        provider: {
          select: {
            ID: true,
            nome_fantasia: true,
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        userClose: {
          select: {
            login: true,
            name: true,
          },
        },
        quotationItem: {
          select: {
            id: true,
            valor: true,
            quantidade: true,
            observacao: true,
            item: {
              select: {
                id: true,
                quantidade: true,
                material: {
                  select: {
                    id: true,
                    material: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id_fornecedor: providerId,
      },
    });

    return quotation;
  }

  async findByBuyAndProvider(
    buyId: number,
    providerId: number,
  ): Promise<IBuyQuotation['findByBuyAndProvider'] | null> {
    const quotation = await this.table.findFirst({
      select: {
        id: true,
        buy: {
          select: {
            id: true,
            numero: true,
            buyStatus: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        provider: {
          select: {
            ID: true,
            nome_fantasia: true,
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
        userClose: {
          select: {
            login: true,
            name: true,
          },
        },
        quotationItem: {
          select: {
            id: true,
            valor: true,
            quantidade: true,
            observacao: true,
            item: {
              select: {
                id: true,
                quantidade: true,
                material: {
                  select: {
                    id: true,
                    material: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id_compra: buyId,
        id_fornecedor: providerId,
      },
    });

    return quotation;
  }

  async create(
    data: Prisma.smartnewsystem_compras_cotacaoUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_cotacao> {
    const quotation = await this.table.create({
      data,
    });

    return quotation;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_compras_cotacaoUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_cotacao> {
    const quotation = await this.table.update({
      where: { id },
      data,
    });

    return quotation;
  }

  async delete(id: number): Promise<true> {
    await this.table.delete({
      where: { id },
    });

    return true;
  }
}
