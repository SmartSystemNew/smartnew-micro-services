import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import IBuyRequest from 'src/models/IBuyRequest';
import BuyRequestRepository from '../buy-request-repository';
import { Prisma, smartnewsystem_compras_numeros_fiscais } from '@prisma/client';

@Injectable()
export default class BuyRequestRepositoryPrisma
  implements BuyRequestRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_compras_numeros_fiscais;

  async countByBranches(
    branches: number[],
    filter?: Prisma.smartnewsystem_compras_numeros_fiscaisWhereInput | null,
  ): Promise<number> {
    const count = await this.table.count({
      where: {
        buy: {
          id_filial: {
            in: branches,
          },
        },
        ...filter,
      },
    });

    return count;
  }

  async listByBranches(
    branches: number[],
    index?: number | null,
    perPage?: number | null,
    filter?: Prisma.smartnewsystem_compras_numeros_fiscaisWhereInput | null,
  ): Promise<IBuyRequest['listTable'][]> {
    const request = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      ...(index !== null && {
        skip: index * perPage,
        take: perPage,
      }),
      select: {
        id: true,
        numero: true,
        requestProvider: {
          select: {
            id: true,
            provider: {
              select: {
                ID: true,
                nome_fantasia: true,
              },
            },
            finance: {
              select: {
                id: true,
                numero_fiscal: true,
              },
            },
          },
        },
        buy: {
          select: {
            id: true,
            numero: true,
            fechamento: true,
            observacao: true,
            branch: {
              select: {
                ID: true,
                filial_numero: true,
              },
            },
            buyQuotationDiscount: {
              select: {
                id: true,
                provider: {
                  select: {
                    ID: true,
                    nome_fantasia: true,
                  },
                },
                tipo: true,
                valor: true,
              },
            },
            userResponsible: {
              select: {
                login: true,
                name: true,
              },
            },
            conditionAnswer: {
              select: {
                id: true,
                resposta: true,
                condition: {
                  select: {
                    id: true,
                    condicao: true,
                  },
                },
                provider: {
                  select: {
                    ID: true,
                    nome_fantasia: true,
                  },
                },
              },
            },
            buyPreFinance: {
              select: {
                id: true,
                buyPreFinancePayment: {
                  select: {
                    id: true,
                    vencimento: true,
                    paymentType: {
                      select: {
                        id: true,
                        descricao: true,
                      },
                    },
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
          },
        },
        provider: {
          select: {
            ID: true,
            nome_fantasia: true,
            cnpj: true,
          },
        },
        requestItem: {
          select: {
            id: true,
            status: {
              select: {
                id: true,
                status: true,
                icone: true,
              },
            },
            quotationItem: {
              select: {
                id: true,
                quantidade: true,
                valor: true,
              },
            },
          },
        },
      },
      where: {
        buy: {
          id_filial: {
            in: branches,
          },
        },
        ...filter,
      },
    });

    return request;
  }

  async findById(id: number): Promise<IBuyRequest['findById'] | null> {
    const buyRequest = await this.table.findUnique({
      select: {
        id: true,
        numero: true,
        numero_fiscal: true,
        data_emissao: true,
        chave: true,
        typeDocument: {
          select: {
            id: true,
            descricao: true,
          },
        },
        requestProvider: {
          select: {
            id: true,
            provider: {
              select: {
                ID: true,
                nome_fantasia: true,
              },
            },
            finance: {
              select: {
                id: true,
                numero_fiscal: true,
                data_emissao: true,
                chave: true,
                quantidade_parcela: true,
                frequencia_pagamento: true,
                frequencia_fixa: true,
                parcelar: true,
                data_vencimento: true,
                paymentType: {
                  select: {
                    id: true,
                    descricao: true,
                  },
                },
                documentType: {
                  select: {
                    id: true,
                    descricao: true,
                  },
                },
                items: {
                  select: {
                    id: true,
                    quantidade: true,
                    preco_unitario: true,
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
                        material: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        buy: {
          select: {
            id: true,
            numero: true,
            fechamento: true,
            observacao: true,
            branch: {
              select: {
                ID: true,
                filial_numero: true,
              },
            },
            buyQuotationDiscount: {
              select: {
                id: true,
                provider: {
                  select: {
                    ID: true,
                    nome_fantasia: true,
                  },
                },
                tipo: true,
                valor: true,
              },
            },
            userResponsible: {
              select: {
                login: true,
                name: true,
              },
            },
            conditionAnswer: {
              select: {
                id: true,
                resposta: true,
                condition: {
                  select: {
                    id: true,
                    condicao: true,
                  },
                },
                provider: {
                  select: {
                    ID: true,
                    nome_fantasia: true,
                  },
                },
              },
            },
            buyPreFinance: {
              select: {
                id: true,
                buyPreFinancePayment: {
                  select: {
                    id: true,
                    vencimento: true,
                    quantidade_parcela: true,
                    frequencia: true,
                    frequencia_fixa: true,
                    parcelar: true,
                    paymentType: {
                      select: {
                        id: true,
                        descricao: true,
                      },
                    },
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
          },
        },
        provider: {
          select: {
            ID: true,
            nome_fantasia: true,
            cnpj: true,
          },
        },
        requestItem: {
          select: {
            id: true,
            status: {
              select: {
                id: true,
                status: true,
                icone: true,
                finaliza: true,
              },
            },
            quotationItem: {
              select: {
                id: true,
                quantidade: true,
                valor: true,
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });

    return buyRequest;
  }

  async listByBuy(buyId: number): Promise<IBuyRequest['listByBuy'][]> {
    const buyRequest = await this.table.findMany({
      select: {
        id: true,
        numero: true,
        numero_fiscal: true,
        data_emissao: true,
        chave: true,
        typeDocument: {
          select: {
            id: true,
            descricao: true,
          },
        },
        requestProvider: {
          select: {
            id: true,
            provider: {
              select: {
                ID: true,
                nome_fantasia: true,
              },
            },
            finance: {
              select: {
                id: true,
                numero_fiscal: true,
                data_emissao: true,
                chave: true,
                documentType: {
                  select: {
                    id: true,
                    descricao: true,
                  },
                },
                items: {
                  select: {
                    id: true,
                    quantidade: true,
                    preco_unitario: true,
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
                        material: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        buy: {
          select: {
            id: true,
            numero: true,
            fechamento: true,
            observacao: true,
            branch: {
              select: {
                ID: true,
                filial_numero: true,
              },
            },
            buyQuotationDiscount: {
              select: {
                id: true,
                provider: {
                  select: {
                    ID: true,
                    nome_fantasia: true,
                  },
                },
                tipo: true,
                valor: true,
              },
            },
            userResponsible: {
              select: {
                login: true,
                name: true,
              },
            },
            conditionAnswer: {
              select: {
                id: true,
                resposta: true,
                condition: {
                  select: {
                    id: true,
                    condicao: true,
                  },
                },
                provider: {
                  select: {
                    ID: true,
                    nome_fantasia: true,
                  },
                },
              },
            },
            buyPreFinance: {
              select: {
                id: true,
                buyPreFinancePayment: {
                  select: {
                    id: true,
                    vencimento: true,
                    paymentType: {
                      select: {
                        id: true,
                        descricao: true,
                      },
                    },
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
          },
        },
        provider: {
          select: {
            ID: true,
            nome_fantasia: true,
            cnpj: true,
          },
        },
        requestItem: {
          select: {
            id: true,
            status: {
              select: {
                id: true,
                status: true,
                icone: true,
                finaliza: true,
              },
            },
            quotationItem: {
              select: {
                id: true,
                quantidade: true,
                valor: true,
              },
            },
          },
        },
      },
      where: {
        id_compra: buyId,
      },
    });

    return buyRequest;
  }

  async create(
    data: Prisma.smartnewsystem_compras_numeros_fiscaisUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_numeros_fiscais> {
    const buyRequest = this.table.create({
      data,
    });

    return buyRequest;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_compras_numeros_fiscaisUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_numeros_fiscais> {
    const buyRequest = await this.table.update({
      where: {
        id,
      },
      data,
    });

    return buyRequest;
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
