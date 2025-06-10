import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_material_estoque } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import IWarehouseBuy from 'src/models/IWarehouseBuy';
import MaterialEstoqueRepository from '../material-estoque-repository';

@Injectable()
export default class MaterialEstoqueRepositoryPrisma
  implements MaterialEstoqueRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_material_estoque;

  async groupByMaterialSecondApproved(
    branches: number[],
  ): Promise<IWarehouseBuy['groupByMaterialSecondApproved'][]> {
    const allMaterialSecond = await this.table.findMany({
      select: {
        id: true,
        id_material_secundario: true,
        quantidade: true,
      },
      where: {
        id_filial: {
          in: branches,
        },
        status: 1,
      },
    });

    const groupSecond: IWarehouseBuy['groupByMaterialSecondApproved'][] = [];

    allMaterialSecond.forEach((item) => {
      const findIndex = groupSecond.findIndex(
        (value) => value.id === item.id_material_secundario,
      );

      if (findIndex >= 0) {
        groupSecond[findIndex].quantidade += item.quantidade;
      } else {
        groupSecond.push({
          id: item.id_material_secundario,
          quantidade: item.quantidade,
        });
      }
    });

    return groupSecond;
  }

  async listByMaterial(
    materialId: number,
  ): Promise<smartnewsystem_material_estoque[]> {
    const materialEstoques = await this.table.findMany({
      where: {
        id_material: materialId,
      },
    });

    return materialEstoques;
  }

  async findByBuyAndItem(
    buyId: number,
    itemId: number,
  ): Promise<IWarehouseBuy['findByBuyAndItem'] | null> {
    const materialEstoque = await this.table.findFirst({
      select: {
        id: true,
        id_material: true,
        id_compra: true,
        quantidade: true,
        id_material_secundario: true,
        id_cliente: true,
        id_item: true,
        id_filial: true,
        status: true,
        log_date: true,
        log_user: true,
        retirada: true,
        buy: {
          select: {
            numero: true,
            branch: {
              select: {
                filial_numero: true,
              },
            },
          },
        },
        material: {
          select: {
            id: true,
            material: true,
            unidade: true,
            codigo_secundario: true,
            codigo_ncm: true,
          },
        },
        itemBuy: {
          select: {
            id: true,
            estoque: true,
            quantidade: true,
            compositionItem: {
              select: {
                composicao: true,
                descricao: true,
                compositionGroup: {
                  select: {
                    composicao: true,
                    descricao: true,
                    costCenter: {
                      select: {
                        centro_custo: true,
                        descricao: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        materialCodigo: {
          select: {
            classificacao: true,
            codigo: true,
            especificacao: true,
            marca: true,
          },
        },
        stockWithdrawal: {
          select: {
            id: true,
            responsavel: true,
            url: true,
            log_date: true,
          },
        },
      },
      where: {
        id_compra: buyId,
        id_item: itemId,
      },
    });

    return materialEstoque;
  }

  async findById(id: number): Promise<IWarehouseBuy['findById'] | null> {
    const materialEstoque = await this.table.findFirst({
      select: {
        id: true,
        id_material: true,
        id_compra: true,
        quantidade: true,
        id_material_secundario: true,
        id_cliente: true,
        id_item: true,
        id_filial: true,
        status: true,
        log_date: true,
        log_user: true,
        retirada: true,
        buy: {
          select: {
            id: true,
            numero: true,
            branch: {
              select: {
                filial_numero: true,
              },
            },
          },
        },
        material: {
          select: {
            id: true,
            material: true,
            unidade: true,
            codigo_secundario: true,
            codigo_ncm: true,
          },
        },
        itemBuy: {
          select: {
            id: true,
            estoque: true,
            quantidade: true,
            compositionItem: {
              select: {
                composicao: true,
                descricao: true,
                compositionGroup: {
                  select: {
                    composicao: true,
                    descricao: true,
                    costCenter: {
                      select: {
                        centro_custo: true,
                        descricao: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        itemMaterial: {
          select: {
            id: true,
            serviceOrder: {
              select: {
                ID: true,
                ordem: true,
              },
            },
          },
        },
        materialCodigo: {
          select: {
            classificacao: true,
            codigo: true,
            especificacao: true,
            marca: true,
          },
        },
        stockWithdrawal: {
          select: {
            id: true,
            responsavel: true,
            url: true,
            log_date: true,
          },
        },
      },
      where: {
        id: id,
      },
    });

    return materialEstoque;
  }

  async findByMaterialServiceOrder(
    materialServiceId: number,
  ): Promise<smartnewsystem_material_estoque | null> {
    const stock = await this.table.findFirst({
      where: {
        id_item_material_servico: materialServiceId,
      },
    });

    return stock;
  }

  async create(
    data: Prisma.smartnewsystem_material_estoqueUncheckedCreateInput,
  ): Promise<smartnewsystem_material_estoque> {
    const materialEstoque = await this.table.create({
      data: data,
    });

    return materialEstoque;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_material_estoqueUncheckedUpdateInput,
  ): Promise<smartnewsystem_material_estoque> {
    const materialEstoque = await this.table.update({
      where: {
        id: id,
      },
      data: data,
    });

    return materialEstoque;
  }

  async findOne(
    where: Prisma.smartnewsystem_material_estoqueWhereUniqueInput,
  ): Promise<IWarehouseBuy['findOne'] | null> {
    const material =
      this.prismaService.smartnewsystem_material_estoque.findUnique({
        select: {
          id: true,
          status: true,
          id_item_material_servico: true,
          buy: {
            select: {
              id: true,
              status: true,
              item: {
                select: {
                  id: true,
                  estoque: true,
                },
              },
            },
          },
        },
        where,
      });

    return material;
  }

  async findManyByCompra(
    idCompra: number,
  ): Promise<smartnewsystem_material_estoque[]> {
    return this.table.findMany({
      where: { id_compra: idCompra },
    });
  }

  async updateManyByCompra(
    idCompra: number,
    data: Prisma.smartnewsystem_material_estoqueUncheckedUpdateInput,
  ): Promise<any> {
    await this.table.updateMany({
      where: {
        id_compra: idCompra,
      },
      data: data,
    });
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id: id,
      },
    });

    return true;
  }

  async findByMaterial(
    materialId: number,
    compraId: number,
    itemId: number,
  ): Promise<smartnewsystem_material_estoque | null> {
    const materialEstoque = await this.table.findFirst({
      where: {
        id_material: materialId,
        id_compra: compraId,
        id_item: itemId,
      },
    });

    return materialEstoque;
  }

  async findByMaterialAndEstoque(
    branchId: number[],
    filter?: Prisma.smartnewsystem_material_estoqueWhereInput | null,
  ): Promise<IWarehouseBuy['listMaterial'][]> {
    const materialEstoque = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        id_material: true,
        id_compra: true,
        quantidade: true,
        id_material_secundario: true,
        id_cliente: true,
        id_item: true,
        id_filial: true,
        status: true,
        log_date: true,
        log_user: true,
        retirada: true,
        buy: {
          select: {
            numero: true,
            branch: {
              select: {
                ID: true,
                filial_numero: true,
              },
            },
          },
        },
        material: {
          select: {
            id: true,
            material: true,
            unidade: true,
            codigo_secundario: true,
            codigo_ncm: true,
          },
        },
        itemBuy: {
          select: {
            estoque: true,
            quantidade: true,
            compositionItem: {
              select: {
                composicao: true,
                descricao: true,
                compositionGroup: {
                  select: {
                    composicao: true,
                    descricao: true,
                    costCenter: {
                      select: {
                        centro_custo: true,
                        descricao: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        materialCodigo: {
          select: {
            id: true,
            classificacao: true,
            codigo: true,
            especificacao: true,
            marca: true,
          },
        },
        stockWithdrawal: {
          select: {
            id: true,
            responsavel: true,
            url: true,
            log_date: true,
          },
        },
      },
      where: {
        id_filial: {
          in: branchId,
        },
        ...filter,
      },
    });

    return materialEstoque;
  }

  async listWithDrawal(
    branchId: number[],
    filter?: Prisma.smartnewsystem_material_estoqueWhereInput | null,
  ): Promise<IWarehouseBuy['listWithDrawal'][]> {
    const materialEstoque = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        id_material: true,
        id_compra: true,
        quantidade: true,
        id_material_secundario: true,
        id_cliente: true,
        id_item: true,
        id_filial: true,
        status: true,
        log_date: true,
        log_user: true,
        retirada: true,
        buy: {
          select: {
            numero: true,
            branch: {
              select: {
                filial_numero: true,
              },
            },
          },
        },
        material: {
          select: {
            material: true,
            unidade: true,
            codigo_secundario: true,
            codigo_ncm: true,
          },
        },
        itemBuy: {
          select: {
            estoque: true,
            quantidade: true,
            compositionItem: {
              select: {
                composicao: true,
                descricao: true,
                compositionGroup: {
                  select: {
                    composicao: true,
                    descricao: true,
                    costCenter: {
                      select: {
                        centro_custo: true,
                        descricao: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        materialCodigo: {
          select: {
            id: true,
            classificacao: true,
            codigo: true,
            especificacao: true,
            marca: true,
          },
        },
        stockWithdrawal: {
          select: {
            id: true,
            responsavel: true,
            url: true,
            observacao: true,
            log_date: true,
          },
        },
      },
      where: {
        id_filial: {
          in: branchId,
        },
        status: 1,
        ...filter,
      },
    });

    return materialEstoque;
  }
}
