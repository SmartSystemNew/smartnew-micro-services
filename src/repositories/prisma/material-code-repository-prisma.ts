import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_material_codigo } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import IMaterialCode from 'src/models/IMaterialCode';
import MaterialCodeRepository from '../material-code-repository';

@Injectable()
export default class MaterialCodeRepositoryPrisma
  implements MaterialCodeRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_material_codigo;

  async listByMaterial(
    materialId: number,
  ): Promise<smartnewsystem_material_codigo[]> {
    const materialCodes = await this.table.findMany({
      where: {
        id_material: materialId,
      },
    });

    return materialCodes;
  }

  async lisByMaterialAndCode(
    materialId: number,
  ): Promise<IMaterialCode['listByMaterialAndCode'][]> {
    const materialCodes = await this.table.findMany({
      where: {
        id_material: materialId,
      },
      select: {
        id: true,
        codigo: true,
        id_material: true,
        marca: true,
        classificacao: true,
        especificacao: true,
        id_cliente: true,
        estoque_max: true,
        estoque_min: true,
        material: {
          select: {
            id: true,
            material: true,
          },
        },
        smartnewsystem_material_estoque: {
          select: {
            id: true,
            quantidade: true,
            id_material: true,
            status: true,
          },
        },
      },
    });

    return materialCodes;
  }

  async findDuplicateByMaterial(
    materialId: number,
    code: string,
  ): Promise<smartnewsystem_material_codigo | null> {
    const materialCode = await this.table.findFirst({
      where: {
        id_material: materialId,
        codigo: code,
      },
    });

    return materialCode;
  }

  async MaterialExist(
    code: string,
  ): Promise<smartnewsystem_material_codigo | null> {
    const materialCode = await this.table.findFirst({
      where: {
        codigo: code,
      },
    });

    return materialCode;
  }

  async MaterialExistInMaterial(
    materialId: number,
    code: string,
    codeId: number,
  ): Promise<smartnewsystem_material_codigo | null> {
    const materialCode = await this.table.findFirst({
      where: {
        id: {
          not: codeId,
        },
        id_material: materialId,
        codigo: code,
      },
    });

    return materialCode;
  }

  async findById(id: number): Promise<IMaterialCode['listById']> {
    const materialCode = await this.table.findUnique({
      select: {
        id: true,
        codigo: true,
        classificacao: true,
        marca: true,
        especificacao: true,
        id_cliente: true,
        id_material: true,
        material: {
          select: {
            id: true,
            codigo: true,
            material: true,
            unidade: true,
            id_categoria: true,
            id_cliente: true,
            localizacao: true,
            observacao: true,
            ativo: true,
            estoque_min: true,
            estoque_max: true,
            tipo: true,
            codigo_ncm: true,
            codigo_secundario: true,
          },
        },
        stockIn: {
          select: {
            id: true,
            numero_serie: true,
            quantidade: true,
            valor_unitario: true,
          },
        },
        materialServiceOrder: {
          select: {
            id: true,
            codigo: true,
            quantidade: true,
            valor_unidade: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return materialCode;
  }

  async listByClient(
    clientId: number,
    index?: number | null,
    perPage?: number | null,
    filter?: Prisma.smartnewsystem_material_codigoWhereInput | null,
  ): Promise<IMaterialCode['listByClient'][]> {
    const materialCode = await this.table.findMany({
      ...(index !== null ? { skip: index * perPage, take: perPage } : {}),
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        codigo: true,
        classificacao: true,
        marca: true,
        especificacao: true,
        id_cliente: true,
        id_material: true,
        estoque_max: true,
        estoque_min: true,
        material: {
          select: {
            id: true,
            codigo: true,
            material: true,
            unidade: true,
            localizacao: true,
            observacao: true,
            ativo: true,
            tipo: true,
            codigo_ncm: true,
            log_user: true,
            categoryMaterial: {
              select: {
                id: true,
                descricao: true,
              },
            },
            branch: {
              select: {
                ID: true,
                razao_social: true,
              },
            },
            location: {
              select: {
                id: true,
                localizacao: true,
              },
            },
          },
        },
        // stockIn: {
        //   select: {
        //     id: true,
        //     numero_serie: true,
        //     quantidade: true,
        //     valor_unitario: true,
        //   },
        // },
        // materialServiceOrder: {
        //   select: {
        //     id: true,
        //     codigo: true,
        //     quantidade: true,
        //     valor_unidade: true,
        //   },
        // },
      },
      where: {
        id_cliente: clientId,
        // material: {
        //   tipo: 'stock',
        // },
        ...filter,
      },
    });

    return materialCode;
  }

  async listByTypeMaterial(
    clientId: number,
    index?: number | null,
    perPage?: number | null,
    filter?: Prisma.smartnewsystem_material_codigoWhereInput | null,
  ): Promise<IMaterialCode['listByTypeMaterial'][]> {
    const materialCode = await this.table.findMany({
      ...(index !== null ? { skip: index * perPage, take: perPage } : {}),
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        codigo: true,
        classificacao: true,
        marca: true,
        especificacao: true,
        id_cliente: true,
        id_material: true,
        estoque_max: true,
        estoque_min: true,
        material: {
          select: {
            id: true,
            codigo: true,
            material: true,
            unidade: true,
            localizacao: true,
            observacao: true,
            ativo: true,
            tipo: true,
            codigo_ncm: true,
            log_user: true,
            categoryMaterial: {
              select: {
                id: true,
                descricao: true,
              },
            },
            branch: {
              select: {
                ID: true,
                razao_social: true,
              },
            },
          },
        },
        // stockIn: {
        //   select: {
        //     id: true,
        //     numero_serie: true,
        //     quantidade: true,
        //     valor_unitario: true,
        //   },
        // },
        // materialServiceOrder: {
        //   select: {
        //     id: true,
        //     codigo: true,
        //     quantidade: true,
        //     valor_unidade: true,
        //   },
        // },
      },
      where: {
        id_cliente: clientId,
        material: {
          tipo: 'stock',
        },
        // material: {
        //   tipo: 'stock',
        // },
        ...filter,
      },
    });

    return materialCode;
  }

  async countListByClient(
    clientId: number,
    filter?: Prisma.smartnewsystem_material_codigoWhereInput | null,
  ): Promise<number> {
    const materialCode = await this.table.count({
      where: {
        id_cliente: clientId,
        material: {
          tipo: 'stock',
        },
        ...filter,
      },
    });

    return materialCode;
  }

  async findByMaterial(
    idMaterial: number,
  ): Promise<IMaterialCode['findByMaterial'][]> {
    const materialCode = await this.table.findMany({
      select: {
        id: true,
        codigo: true,
        classificacao: true,
        marca: true,
        especificacao: true,
        id_cliente: true,
        id_material: true,
        material: {
          select: {
            id: true,
            codigo: true,
            material: true,
            unidade: true,
            id_categoria: true,
            id_cliente: true,
            localizacao: true,
            observacao: true,
            ativo: true,
            estoque_min: true,
            estoque_max: true,
            tipo: true,
            codigo_ncm: true,
            codigo_secundario: true,
          },
        },
        stockIn: {
          select: {
            id: true,
            numero_serie: true,
            quantidade: true,
            valor_unitario: true,
          },
        },
        materialServiceOrder: {
          select: {
            id: true,
            codigo: true,
            quantidade: true,
            valor_unidade: true,
          },
        },
      },
      where: {
        id_material: idMaterial,
      },
    });

    return materialCode;
  }

  async listForReportStockByClient(
    clientId: number,
    index?: number | null,
    perPage?: number | null,
    currentDate?: Date | null,
    filter?: Prisma.smartnewsystem_material_codigoWhereInput | null,
  ): Promise<IMaterialCode['listForReportStockByClient'][]> {
    const obj = await this.table.findMany({
      ...(index !== null ? { skip: index * perPage, take: perPage } : {}),
      select: {
        id: true,
        id_cliente: true,
        codigo: true,
        marca: true,
        classificacao: true,
        especificacao: true,
        material: {
          select: {
            id: true,
            material: true,
            unidade: true,
            ativo: true,
            valor: true,
            Valor_venda: true,
            fator: true,
            estoque_min: true,
            estoque_max: true,
            estoque_real: true,
            localizacao: true,
            log_date: true,
            log_user: true,
            sessao_id: true,
            DataEstoqueMin: true,
            id_categoria: true,
            categoryMaterial: {
              select: {
                id: true,
                descricao: true,
              },
            },
            company: {
              select: {
                ID: true,
                razao_social: true,
              },
            },
          },
        },
        stockIn: {
          select: {
            id: true,
            numero_serie: true,
            quantidade: true,
            data_entrada: true,
            valor_unitario: true,
          },
          where: {
            stock: {
              data_entrada: currentDate,
            },
          },
        },
        materialServiceOrder: {
          select: {
            id: true,
            codigo: true,
            data_uso: true,
            valor_unidade: true,
            quantidade: true,
          },
          where: {
            data_uso: currentDate,
          },
        },
        // purchaseItemRequest: {
        //   select: {
        //     id: true,
        //     observacao: true,
        //   },
        // },
        // itemForMaterial: {
        //   select: {
        //     id: true,
        //     item: true,
        //   },
        // },
      },
      where: {
        id_cliente: clientId,
        ...filter,
      },
    });
    return obj;
  }

  async create(
    data: Prisma.smartnewsystem_material_codigoUncheckedCreateInput,
  ): Promise<smartnewsystem_material_codigo> {
    const materialCode = await this.table.create({ data });

    return materialCode;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_material_codigoUncheckedUpdateInput,
  ): Promise<smartnewsystem_material_codigo> {
    const materialCode = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return materialCode;
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
